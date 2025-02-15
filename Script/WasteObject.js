class WasteGameObject {
    constructor(x, y, width, height, imageSrc) {
      this.x = x; // x 좌표
      this.y = y; // y 좌표
      this.width = width; // 너비
      this.height = height; // 높이
      this.image = new Image();
      this.image.src = imageSrc; // 이미지 소스
      this.isDragging = false; // 드래그 상태
      this.offsetX = 0; // 드래그 시작 시 x 오프셋
      this.offsetY = 0; // 드래그 시작 시 y 오프셋
    }
  
    // 폐기물 그리기
    draw(ctx) {
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
  
    // 드래그 시작
    startDrag(mouseX, mouseY) {
      this.isDragging = true;
      this.offsetX = mouseX - this.x;
      this.offsetY = mouseY - this.y;
    }
  
    // 드래그 중
    drag(mouseX, mouseY) {
      if (this.isDragging) {
        this.x = mouseX - this.offsetX;
        this.y = mouseY - this.offsetY;
      }
    }
  
    // 드래그 종료
    endDrag() {
      this.isDragging = false;
    }
  
    // 지정된 위치로 이동
    moveTo(x, y) {
      this.x = x;
      this.y = y;
    }
}