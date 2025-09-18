import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ClassService } from 'src/app/core/services/ClassService';
import { GymClass } from 'src/app/core/models/GymClass';

@Component({
  selector: 'app-generate-schadule',
  templateUrl: './generate-schadule.component.html',
  styleUrls: ['./generate-schadule.component.css']
})
export class GenerateSchaduleComponent implements OnInit {
  isGeneratingSchedule = false;
  @Output() closeGenerateModal = new EventEmitter();

  private logoImg: HTMLImageElement | null = null;

  constructor(
    private classService: ClassService,
    private toaster: ToastrService
  ) { }

  ngOnInit(): void {
    this.preloadLogo();
    this.generateWeeklySchedule();
  }

  private preloadLogo() {
    this.loadImage('assets/images/logos/logo.jpg')
      .then(img => this.logoImg = img)
      .catch(() => this.logoImg = null);
  }

  private getStartOfWeek(today: Date): Date {
    const startDate = new Date(today);
    const diff = (today.getDay() + 1) % 7; // makes Saturday = 0
    startDate.setDate(today.getDate() - diff);
    return startDate;
  }

  generateWeeklySchedule() {
    this.isGeneratingSchedule = true;
    const today = new Date();
    const startDate = this.getStartOfWeek(today);
    const formattedDate = this.formatDate(startDate);

    this.classService.getWeeklySchedule(formattedDate).subscribe({
      next: (res: any) => {
        if (res.State && res.Data?.length >= 3) {
          const start = new Date(res.Data[0]);
          const end = new Date(res.Data[1]);
          const classes = res.Data[2] || [];
          this.generateScheduleImage(classes, start, end);
        }
      },
      error: (err) => {
        console.error('Error generating schedule', err);
        this.toaster.error('Failed to generate weekly schedule');
      },
      complete: () => {
        this.isGeneratingSchedule = false;
      }
    });
  }

  private async generateScheduleImage(classes: GymClass[], startDate: Date, endDate: Date) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      this.toaster.error('Failed to generate image');
      return;
    }

    canvas.width = 1200;
    canvas.height = 800;

    this.drawBackground(ctx, canvas);
    await this.drawLogo(ctx);
    this.drawHeader(ctx, startDate, endDate);

    const classMap = this.buildClassMap(classes);
    this.drawTable(ctx, classMap);

    this.downloadCanvasImage(canvas, startDate, endDate);
  }

  // 🎨 Drawing Helpers
  private drawBackground(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#f8f9fa');
    gradient.addColorStop(1, '#ffffff');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  private async drawLogo(ctx: CanvasRenderingContext2D) {
    if (!this.logoImg) {
      ctx.fillStyle = 'rgba(221, 0, 92, 0.1)';
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'left';
      ctx.fillText('GYM LOGO', 40, 60);
      return;
    }

    const logoSize = 80;
    const logoX = 60;
    const logoY = 10;

    ctx.beginPath();
    ctx.arc(logoX + logoSize / 2, logoY + logoSize / 2, logoSize / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.save();
    ctx.clip();

    ctx.drawImage(this.logoImg, logoX, logoY, logoSize, logoSize);
    ctx.restore();

    ctx.beginPath();
    ctx.arc(logoX + logoSize / 2, logoY + logoSize / 2, logoSize / 2, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(221, 0, 92, 0.5)';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  private drawHeader(ctx: CanvasRenderingContext2D, startDate: Date, endDate: Date) {
    ctx.fillStyle = 'rgba(221, 0, 92, 0.9)';
    ctx.fillRect(0, 100, 1200, 70);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('WEEKLY CLASS SCHEDULE', 600, 150);

    ctx.fillStyle = '#6c757d';
    ctx.font = '16px Arial';
    ctx.fillText(
      `${startDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`,
      600,
      200
    );
  }

  private drawTable(ctx: CanvasRenderingContext2D, classMap: Map<string, GymClass[]>) {
    const days = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const timeSlots = [...new Set([...classMap.keys()].map(k => k.split('-')[1]))].sort();

    const dayColumnWidth = 150;
    const timeRowHeight = 50;
    const classCellWidth = 100;
    const classCellHeight = 80;
    const startX = dayColumnWidth + 20;
    const startY = 270;

    // Days column
    days.forEach((day, i) => {
      const y = startY + (i * classCellHeight);
      ctx.fillStyle = 'rgba(221, 0, 92, 0.8)';
      ctx.fillRect(20, y, dayColumnWidth, classCellHeight);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      this.wrapText(ctx, day.toUpperCase(), 20 + dayColumnWidth / 2, y + classCellHeight / 2, dayColumnWidth - 20, 20);
    });

    // Time slots row
    timeSlots.forEach((slot, i) => {
      const x = startX + (i * classCellWidth);
      ctx.fillStyle = 'rgba(221, 0, 92, 0.8)';
      ctx.fillRect(x, startY - timeRowHeight, classCellWidth, timeRowHeight);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(this.formatTo12Hour(slot), x + classCellWidth / 2, startY - timeRowHeight / 2 + 5);
    });

    // Classes
    days.forEach((_, dayIndex) => {
      timeSlots.forEach((slot, timeIndex) => {
        const x = startX + (timeIndex * classCellWidth);
        const y = startY + (dayIndex * classCellHeight);

        ctx.fillStyle = (dayIndex + timeIndex) % 2 === 0 ? 'rgba(222, 226, 230, 0.5)' : '#ffffff';
        ctx.fillRect(x, y, classCellWidth, classCellHeight);

        const key = `${dayIndex}-${slot}`;
        const dayClasses = classMap.get(key) || [];
        dayClasses.forEach((cls, idx) => {
          ctx.fillStyle = '#000000';
          ctx.textAlign = 'center';

          // --- Class name ---
          ctx.font = 'bold 12px Arial';
          this.wrapText(
            ctx,
            cls.Name,
            x + classCellWidth / 2,               // center X
            y + 20 + (idx * 45),                  // Y position for class name
            classCellWidth - 10,                  // max width
            20,                                   // line height
            12                                    // font size
          );

          // --- Trainer name ---
          ctx.font = 'italic 12px Arial';
          ctx.fillStyle = 'gray';
          this.wrapText(
            ctx,
            `with ${cls.Trainer.Name}`,
            x + classCellWidth / 2,               // center X
            y + 20 + (idx * 45) + 25,             // margin-y: 5px after class name
            classCellWidth - 10,                  // max width
            20,                                   // line height
            11                                    // font size
          );
        });

      });
    });
  }

  // 🛠️ Utilities
  private buildClassMap(classes: GymClass[]): Map<string, GymClass[]> {
    const map = new Map<string, GymClass[]>();
    classes.forEach(c => {
      const day = new Date(c.ClassDay).getDay();
      const mappedDay = day === 0 ? 1 : day === 6 ? 0 : day + 1;
      const key = `${mappedDay}-${c.ClassTime}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(c);
    });
    return map;
  }

  private loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  private wrapText(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number,
    baseFont: number = 14,
    maxLines: number = 2
  ) {
    let fontSize = baseFont;
    ctx.font = `bold ${fontSize}px Arial`;

    // صغر الفونت لحد ما النص يدخل في maxWidth
    while (ctx.measureText(text).width > maxWidth && fontSize > 8) {
      fontSize -= 1;
      ctx.font = `bold ${fontSize}px Arial`;
    }

    const words = text.split(' ');
    let line = '';
    let lineCount = 0;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      if (ctx.measureText(testLine).width > maxWidth && n > 0) {
        ctx.fillText(line, x, y);
        line = words[n] + ' ';
        y += lineHeight;
        lineCount++;

        if (lineCount >= maxLines) {
          ctx.fillText('...', x, y);
          return;
        }
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line.trim(), x, y);
  }

  private downloadCanvasImage(canvas: HTMLCanvasElement, startDate: Date, endDate: Date) {
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `weekly-schedule-${this.formatDate(startDate)}-to-${this.formatDate(endDate)}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    this.closeGenerateModal.emit();
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  private formatTo12Hour(time: string): string {
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
