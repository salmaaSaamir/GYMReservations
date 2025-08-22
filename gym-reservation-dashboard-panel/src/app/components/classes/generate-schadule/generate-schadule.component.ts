import { Component, OnInit, Output,EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { lastValueFrom } from 'rxjs';
import { GymClass } from 'src/app/core/models/GymClass';
import { ClassService } from 'src/app/core/services/ClassService';

@Component({
  selector: 'app-generate-schadule',
  templateUrl: './generate-schadule.component.html',
  styleUrls: ['./generate-schadule.component.css']
})
export class GenerateSchaduleComponent implements OnInit {
  isGeneratingSchedule = false;
  @Output() closeGenerateModal = new EventEmitter();

  constructor(private ClassService: ClassService, private toaster: ToastrService) { }

  ngOnInit(): void {
    this.generateWeeklySchedule();
  }

  async generateWeeklySchedule() {
    try {
      this.isGeneratingSchedule = true;

      // Get current date
      const today = new Date();

      // Find the most recent Saturday (or today if it's Saturday)
      const startDate = new Date(today);
      while (startDate.getDay() !== 6) { // 6 is Saturday
        startDate.setDate(startDate.getDate() - 1);
      }

      // Format date as YYYY-MM-DD to avoid API parsing errors
      const formattedDate = startDate.toISOString().split('T')[0];

      const res: any = await lastValueFrom(
        this.ClassService.getWeeklySchedule(formattedDate)
      );
      
      if (res.State) {
        const startDate = new Date(res.Data[0]);
        const endDate = new Date(res.Data[1]);
        const classes = res.Data[2] || []; // Fallback to empty array
        this.generateScheduleImage(classes, new Date(startDate), new Date(endDate));
      }
    } catch (error) {
      console.error('Error generating schedule', error);
      this.toaster.error('Failed to generate weekly schedule');
    } finally {
      this.isGeneratingSchedule = false;
    }
  }
private async generateScheduleImage(classes: GymClass[], startDate: Date, endDate: Date) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        this.toaster.error('Failed to generate image');
        return;
    }

    // Set canvas dimensions
    canvas.width = 1200;
    canvas.height = 800;

    // Background with subtle gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#f8f9fa');
    gradient.addColorStop(1, '#ffffff');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

       // Load and draw logo as rounded circle
    try {
        const logo = await this.loadImage('assets/images/logos/logo.jpg');
        const logoSize = 80; // Larger logo size
        const logoX = 60;
        const logoY = 10;
        
        // Create rounded clipping path
        ctx.beginPath();
        ctx.arc(logoX + logoSize/2, logoY + logoSize/2, logoSize/2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.save();
        ctx.clip();
        
        // Draw logo image
        ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);
        ctx.restore();
        
        // Optional: Add border to circle
        ctx.beginPath();
        ctx.arc(logoX + logoSize/2, logoY + logoSize/2, logoSize/2, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(221, 0, 92, 0.5)';
        ctx.lineWidth = 2;
        ctx.stroke();
    } catch (error) {
        console.error('Error loading logo:', error);
        ctx.fillStyle = 'rgba(221, 0, 92, 0.1)';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('GYM LOGO', 40, 60);
    }

    // Header with modern styling
    ctx.fillStyle = 'rgba(221, 0, 92, 0.9)';
    ctx.fillRect(0, 100, canvas.width, 70);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('WEEKLY CLASS SCHEDULE', canvas.width / 2, 150);

    // Date range with subtle styling
    ctx.fillStyle = '#6c757d';
    ctx.font = '16px Arial';
    ctx.fillText(
        `${startDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`,
        canvas.width / 2,
        200
    );

    // Table styling - Days vertical (left), Times horizontal (top)
    const days = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const timeSlots = [...new Set(classes.map(c => c.ClassTime))].sort();
    
    // Dimensions
    const dayColumnWidth = 150;
    const timeRowHeight = 50;
    const classCellWidth = 120;
    const classCellHeight = 60;
    const startX = dayColumnWidth + 20;
    const startY = 270;

    // Draw days (vertical headers)
    for (let i = 0; i < days.length; i++) {
        const y = startY + (i * classCellHeight);
        
        // Day header
        ctx.fillStyle = 'rgba(221, 0, 92, 0.8)';
        ctx.fillRect(20, y, dayColumnWidth, classCellHeight);
        
        // Day name
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        this.wrapText(ctx, days[i].toUpperCase(), 20 + dayColumnWidth/2, y + classCellHeight/2, dayColumnWidth - 20, 20);
    }

    // Draw time slots (horizontal headers)
    for (let i = 0; i < timeSlots.length; i++) {
        const x = startX + (i * classCellWidth);
        
        // Time header
        ctx.fillStyle = 'rgba(221, 0, 92, 0.8)';
        ctx.fillRect(x, startY - timeRowHeight, classCellWidth, timeRowHeight);
        
        // Time
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(this.formatTo12Hour(timeSlots[i]), x + classCellWidth/2, startY - timeRowHeight/2 + 5);
    }

    // Draw classes
    for (let dayIndex = 0; dayIndex < days.length; dayIndex++) {
        for (let timeIndex = 0; timeIndex < timeSlots.length; timeIndex++) {
            const x = startX + (timeIndex * classCellWidth);
            const y = startY + (dayIndex * classCellHeight);
            
            // Cell background - alternate colors
            ctx.fillStyle = (dayIndex + timeIndex) % 2 === 0 ? 'rgba(222, 226, 230, 0.5)' : '#ffffff';
            ctx.fillRect(x, y, classCellWidth, classCellHeight);

            const dayClasses = classes.filter(c => {
                const classDate = new Date(c.ClassDay);
                const classDay = classDate.getDay();
                const mappedDay = classDay === 0 ? 1 : classDay === 6 ? 0 : classDay + 1;
                return mappedDay === dayIndex && c.ClassTime === timeSlots[timeIndex];
            });

            if (dayClasses.length > 0) {
                ctx.fillStyle = '#000000';
                ctx.textAlign = 'center';

                dayClasses.forEach((cls, idx) => {
                    // Class name
                    ctx.font = 'bold 12px Arial';
                    this.wrapText(ctx, cls.Name, x + classCellWidth/2, y + 20 + (idx * 25), classCellWidth - 10, 20);
                    
                    // Trainer name
                    ctx.font = 'italic 11px Arial';
                    ctx.fillText(
                        `with ${cls.Trainer.Name}`,
                        x + classCellWidth / 2,
                        y + 35 + (idx * 25)
                    );
                });
            }
        }
    }

    // Download the image
    this.downloadCanvasImage(canvas, startDate, endDate);
}

// Helper function to load images
private loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

// Helper function for text wrapping
private wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
    const words = text.split(' ');
    let line = '';
    let testLine = '';
    let lineCount = 0;
    const maxLines = 2;

    for (let n = 0; n < words.length; n++) {
        testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            if (lineCount < maxLines - 1) {
                ctx.fillText(line, x, y);
                line = words[n] + ' ';
                y += lineHeight;
                lineCount++;
            } else {
                line = line.substring(0, line.length - 3) + '...';
                break;
            }
        } else {
            line = testLine;
        }
    }
    ctx.fillText(line, x, y);
}

  private downloadCanvasImage(canvas: HTMLCanvasElement, startDate: Date, endDate: Date) {
    // Convert canvas to data URL
    const dataUrl = canvas.toDataURL('image/png');

    // Create a temporary link element
    const link = document.createElement('a');
    link.download = `weekly-schedule-${this.formatDate(startDate)}-to-${this.formatDate(endDate)}.png`;
    link.href = dataUrl;

    // Trigger the download
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
    this.closeGenerateModal.emit();
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0]; // YYYY-MM-DD format
  }

  formatTo12Hour(time: string): string {
    const [hours, minutes] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes);
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  }
}