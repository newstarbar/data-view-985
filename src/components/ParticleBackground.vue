<template>
  <div class="particle-background" ref="particleContainer"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const particleContainer = ref<HTMLElement | null>(null);
let animationId: number | null = null;

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  opacity: number;
}

const particles: Particle[] = [];
const particleCount = 100;

// 创建粒子
const createParticle = (): Particle => {
  if (!particleContainer.value) return { x: 0, y: 0, size: 0, speedX: 0, speedY: 0, color: '', opacity: 0 };
  
  const container = particleContainer.value;
  return {
    x: Math.random() * container.clientWidth,
    y: Math.random() * container.clientHeight,
    size: Math.random() * 2 + 0.5,
    speedX: Math.random() * 0.5 - 0.25,
    speedY: Math.random() * 0.5 - 0.25,
    color: Math.random() > 0.5 ? '#ffffff' : '#1E88E5',
    opacity: Math.random() * 0.5 + 0.1
  };
};

// 初始化粒子
const initParticles = () => {
  particles.length = 0;
  for (let i = 0; i < particleCount; i++) {
    particles.push(createParticle());
  }
};

// 绘制粒子
const drawParticles = () => {
  if (!particleContainer.value) return;
  
  const container = particleContainer.value;
  const canvas = document.createElement('canvas');
  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return;
  
  // 清空画布
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // 绘制每个粒子
  particles.forEach(particle => {
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fillStyle = particle.color;
    ctx.globalAlpha = particle.opacity;
    ctx.fill();
    
    // 更新粒子位置
    particle.x += particle.speedX;
    particle.y += particle.speedY;
    
    // 边界检测
    if (particle.x < 0 || particle.x > canvas.width) {
      particle.speedX *= -1;
    }
    if (particle.y < 0 || particle.y > canvas.height) {
      particle.speedY *= -1;
    }
  });
  
  // 移除旧的canvas
  const oldCanvas = container.querySelector('canvas');
  if (oldCanvas) {
    container.removeChild(oldCanvas);
  }
  
  // 添加新的canvas
  container.appendChild(canvas);
};

// 动画循环
const animate = () => {
  drawParticles();
  animationId = requestAnimationFrame(animate);
};

// 窗口大小变化时重新初始化
const handleResize = () => {
  initParticles();
};

onMounted(() => {
  initParticles();
  animate();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped>
.particle-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
  opacity: 0.3;
}
</style>