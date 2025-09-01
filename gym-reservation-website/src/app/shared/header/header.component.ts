import { CommonModule } from "@angular/common";
import {
  Component,
  OnInit,
  OnDestroy,
  Renderer2,
  ElementRef,
  HostListener,
} from "@angular/core";
import {
  Router,
  RouterModule,
  NavigationEnd,
} from "@angular/router";
import { Subscription } from "rxjs";
declare var $: any;

@Component({
  selector: "app-header",
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit, OnDestroy {
  private scrollSubscription: Subscription | undefined;
  private routerSubscription: Subscription | undefined;
  private headerElement: HTMLElement | null = null;

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.headerElement = document.getElementById("stickyHeader");

    // ✅ عند التنقل بين الصفحات، أعد تهيئة الـ navbar
    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        setTimeout(() => {
          this.reinitializeNavbar();
        }, 50); // أعطِ وقت ل Angular لتحميل العناصر
      }
    });
  }

  // ✅ عند التمرير أضف/أزل كلاس sticky
  @HostListener("window:scroll", ["$event"])
  onWindowScroll() {
    if (this.headerElement) {
      if (window.scrollY > 100) {
        this.renderer.addClass(this.headerElement, "is-sticky");
      } else {
        this.renderer.removeClass(this.headerElement, "is-sticky");
      }
    }
  }

  // ✅ إعادة تهيئة classy-nav (jQuery)
  private reinitializeNavbar() {
    if (typeof $ !== "undefined" && $(".classy-navbar").length > 0) {
      try {
        $(".classy-navbar").removeClass("classy-close"); // Reset if stuck
        $(".classy-menu").removeClass("menu-on");
        $(".navbarToggler").removeClass("active");

        if (typeof $.fn.classyNav === "function") {
          $("#southNav").classyNav(); // Re-initialize
        }
      } catch (err) {
        console.warn("Navbar init error:", err);
      }
    }
  }

  ngOnDestroy(): void {
    if (this.scrollSubscription) this.scrollSubscription.unsubscribe();
    if (this.routerSubscription) this.routerSubscription.unsubscribe();
  }
}
