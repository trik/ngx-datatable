var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Directive, ElementRef, HostListener, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/takeUntil';
let ResizeableDirective = class ResizeableDirective {
    constructor(element) {
        this.resizeEnabled = true;
        this.resize = new EventEmitter();
        this.resizing = false;
        this.element = element.nativeElement;
    }
    ngAfterViewInit() {
        if (this.resizeEnabled) {
            const node = document.createElement('span');
            node.classList.add('resize-handle');
            this.element.appendChild(node);
        }
    }
    ngOnDestroy() {
        this._destroySubscription();
    }
    onMouseup() {
        this.resizing = false;
        if (this.subscription && !this.subscription.closed) {
            this._destroySubscription();
            this.resize.emit(this.element.clientWidth);
        }
    }
    onMousedown(event) {
        const isHandle = (event.target).classList.contains('resize-handle');
        const initialWidth = this.element.clientWidth;
        const mouseDownScreenX = event.screenX;
        if (isHandle) {
            event.stopPropagation();
            this.resizing = true;
            const mouseup = Observable.fromEvent(document, 'mouseup');
            this.subscription = mouseup
                .subscribe((ev) => this.onMouseup());
            const mouseMoveSub = Observable.fromEvent(document, 'mousemove')
                .takeUntil(mouseup)
                .subscribe((e) => this.move(e, initialWidth, mouseDownScreenX));
            this.subscription.add(mouseMoveSub);
        }
    }
    move(event, initialWidth, mouseDownScreenX) {
        const movementX = event.screenX - mouseDownScreenX;
        const newWidth = initialWidth + movementX;
        const overMinWidth = !this.minWidth || newWidth >= this.minWidth;
        const underMaxWidth = !this.maxWidth || newWidth <= this.maxWidth;
        if (overMinWidth && underMaxWidth) {
            this.element.style.width = `${newWidth}px`;
        }
    }
    _destroySubscription() {
        if (this.subscription) {
            this.subscription.unsubscribe();
            this.subscription = undefined;
        }
    }
};
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], ResizeableDirective.prototype, "resizeEnabled", void 0);
__decorate([
    Input(),
    __metadata("design:type", Number)
], ResizeableDirective.prototype, "minWidth", void 0);
__decorate([
    Input(),
    __metadata("design:type", Number)
], ResizeableDirective.prototype, "maxWidth", void 0);
__decorate([
    Output(),
    __metadata("design:type", EventEmitter)
], ResizeableDirective.prototype, "resize", void 0);
__decorate([
    HostListener('mousedown', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [MouseEvent]),
    __metadata("design:returntype", void 0)
], ResizeableDirective.prototype, "onMousedown", null);
ResizeableDirective = __decorate([
    Directive({
        selector: '[resizeable]',
        host: {
            '[class.resizeable]': 'resizeEnabled'
        }
    }),
    __metadata("design:paramtypes", [ElementRef])
], ResizeableDirective);
export { ResizeableDirective };
//# sourceMappingURL=resizeable.directive.js.map