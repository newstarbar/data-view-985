<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import ParticleBackground from "./components/ParticleBackground.vue";

const router = useRouter();
const isMenuOpen = ref(false);
const activeNav = ref("home");
const isDarkMode = ref(false);

// 导航菜单
const navItems = [
	{ path: "/", name: "首页", key: "home" },
	{ path: "/university-analysis", name: "高校分析", key: "university" },
	{ path: "/major-analysis", name: "专业分析", key: "major" },
	{ path: "/admission-policy", name: "招生政策", key: "policy" },
	{ path: "/employment-education", name: "就业深造", key: "employment" },
	{ path: "/data-download", name: "数据下载", key: "download" }
];

// 监听路由变化
router.beforeEach((to, from, next) => {
	console.log("路由切换前:", from.path, "->", to.path);
	// 设置当前激活的导航项
	const navItem = navItems.find((item) => item.path === to.path);
	if (navItem) {
		activeNav.value = navItem.key;
	}
	next();
});

// 路由切换后
router.afterEach((to, from) => {
	console.log("路由切换后:", from.path, "->", to.path);
	// 确保页面滚动到顶部
	window.scrollTo(0, 0);
	// 检查当前的路由组件是否正确渲染
	console.log("当前路由:", to);
	console.log("当前路由组件:", to.matched[0]?.components?.default?.name);
});

// 切换菜单
const toggleMenu = () => {
	isMenuOpen.value = !isMenuOpen.value;
};

// 导航到指定页面
const navigateTo = (path: string) => {
	router.push(path);
	isMenuOpen.value = false;
};

// 切换暗色模式
const toggleDarkMode = () => {
	isDarkMode.value = !isDarkMode.value;
	if (isDarkMode.value) {
		document.documentElement.classList.add("dark-mode");
	} else {
		document.documentElement.classList.remove("dark-mode");
	}
	// 保存到localStorage
	localStorage.setItem("darkMode", isDarkMode.value ? "true" : "false");
};

// 检查localStorage中的暗色模式设置
onMounted(() => {
	// 设置页面标题
	document.title = "985高校招生数据沉浸式可视化分析工具";

	// 恢复暗色模式设置
	const savedDarkMode = localStorage.getItem("darkMode");
	if (savedDarkMode === "true") {
		isDarkMode.value = true;
		document.documentElement.classList.add("dark-mode");
	}
});
</script>

<template>
	<div class="app-container" :class="{ 'dark-mode': isDarkMode }">
		<!-- 粒子背景 -->
		<ParticleBackground />

		<!-- 导航栏 -->
		<header class="app-header floating-nav">
			<div class="header-content container">
				<!-- Logo -->
				<div class="logo">
					<div class="logo-icon">
						<span class="icon-text gradient-text">数据</span>
					</div>
					<div class="logo-text">
						<h1 class="gradient-text">985高校招生数据可视化</h1>
						<p class="subtitle">专业 · 精准 · 沉浸式</p>
					</div>
				</div>

				<!-- 桌面导航菜单 -->
				<nav class="desktop-nav">
					<ul class="nav-list">
						<li v-for="item in navItems" :key="item.key" class="nav-item" @click="navigateTo(item.path)">
							<span class="nav-link" :class="{ active: activeNav === item.key }">{{ item.name }}</span>
						</li>
					</ul>
				</nav>

				<!-- 暗色模式切换 -->
				<div class="mode-toggle" @click="toggleDarkMode">
					<div class="toggle-button" :class="{ active: isDarkMode }"></div>
					<span class="mode-text">{{ isDarkMode ? "🌞" : "🌙" }}</span>
				</div>

				<!-- 移动端菜单按钮 -->
				<button class="mobile-menu-btn" @click="toggleMenu">
					<i class="el-icon-menu"></i>
				</button>
			</div>
		</header>

		<!-- 移动端导航菜单 -->
		<div class="mobile-menu floating-dropdown" v-if="isMenuOpen">
			<ul class="mobile-nav-list">
				<li v-for="item in navItems" :key="item.key" class="mobile-nav-item" :class="{ active: activeNav === item.key }" @click="navigateTo(item.path)">
					<span class="mobile-nav-link">{{ item.name }}</span>
				</li>
			</ul>
		</div>

		<!-- 主内容区域 -->
		<main class="app-main">
			<router-view :key="$route.fullPath" />
		</main>

		<!-- 页脚 -->
		<footer class="app-footer glass-card">
			<div class="footer-content container">
				<div class="footer-info">
					<h3 class="gradient-text">985高校招生数据沉浸式可视化分析工具</h3>
					<p>专业的数据驱动决策支持平台</p>
				</div>
				<div class="footer-links">
					<a href="#">关于我们</a>
					<a href="#">联系我们</a>
					<a href="#">隐私政策</a>
					<a href="#">使用条款</a>
				</div>
				<div class="footer-copyright">
					<p>© 2025 星途科技工作室团队. All rights reserved.</p>
				</div>
			</div>
		</footer>
	</div>
</template>

<style scoped>
.app-container {
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	background-color: var(--bg-primary);
	color: var(--text-primary);
}

.app-header {
	padding: 1rem 0;
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	z-index: 1000;
}

.header-content {
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
}

.logo {
	display: flex;
	align-items: center;
	gap: 1rem;
}

.logo-icon {
	width: 48px;
	height: 48px;
	background: var(--primary-gradient);
	border-radius: 8px;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 0 15px rgba(30, 136, 229, 0.3);
}

.icon-text {
	font-size: 1.2rem;
	font-weight: 700;
	color: white;
}

.logo-text h1 {
	font-size: 1.5rem;
	margin: 0;
	line-height: 1.2;
}

.subtitle {
	font-size: 0.8rem;
	color: var(--text-tertiary);
	margin: 0;
}

.desktop-nav {
	display: flex;
}

.nav-list {
	display: flex;
	list-style: none;
	gap: 0.5rem;
	margin: 0;
	padding: 0;
}

.mobile-menu-btn {
	display: none;
	background: none;
	border: none;
	font-size: 1.5rem;
	color: var(--text-primary);
	cursor: pointer;
	padding: 0.5rem;
}

.mode-toggle {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	margin-left: 1rem;
	cursor: pointer;
}

.mode-text {
	font-size: 1.2rem;
}

.app-main {
	flex: 1;
	margin-top: 80px;
	padding: 2rem 0;
	width: 100%;
}

.app-footer {
	padding: 2rem 0;
	margin-top: auto;
	width: 100%;
}

.footer-content {
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
}

.footer-info h3 {
	font-size: 1.2rem;
	margin-bottom: 0.5rem;
}

.footer-info p {
	font-size: 0.9rem;
	color: var(--text-secondary);
	margin: 0;
}

/* 移动端样式 */
@media (max-width: 768px) {
	.desktop-nav {
		display: none;
	}

	.mobile-menu-btn {
		display: block;
	}

	.logo-text h1 {
		font-size: 1.2rem;
	}

	.logo-text .subtitle {
		font-size: 0.7rem;
	}

	.mobile-menu {
		position: fixed;
		top: 80px;
		right: 20px;
		padding: 1rem;
		z-index: 1000;
		min-width: 200px;
	}

	.mobile-nav-list {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.mobile-nav-item {
		margin-bottom: 1rem;
	}

	.mobile-nav-link {
		display: block;
		padding: 0.5rem;
		color: var(--text-primary);
		text-decoration: none;
		border-radius: 4px;
		transition: background-color var(--transition-fast);
	}

	.mobile-nav-link:hover {
		background-color: rgba(30, 136, 229, 0.1);
	}

	.mobile-nav-link.active {
		color: var(--primary-light);
		font-weight: 600;
	}

	.footer-content {
		flex-direction: column;
		gap: 1rem;
		text-align: center;
	}
}
</style>

<style scoped>
.app-container {
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	background-color: var(--bg-primary);
	overflow-x: hidden;
}

/* 导航栏 */
.app-header {
	background: rgba(0, 25, 60, 0.9);
	border-bottom: 1px solid rgba(0, 191, 255, 0.3);
	backdrop-filter: blur(10px);
	box-shadow: 0 4px 20px rgba(0, 191, 255, 0.1);
	position: sticky;
	top: 0;
	z-index: 1000;
}

.header-content {
	max-width: 1400px;
	margin: 0 auto;
	padding: 15px 20px;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

/* Logo */
.logo {
	display: flex;
	align-items: center;
	gap: 15px;
}

.logo-icon {
	width: 50px;
	height: 50px;
	background: linear-gradient(45deg, #00bfff, #007acc);
	border-radius: 12px;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 0 20px rgba(0, 191, 255, 0.5);
}

.icon-text {
	font-size: 18px;
	font-weight: bold;
	color: #fff;
}

.logo-text h1 {
	margin: 0;
	font-size: 1.5rem;
	color: #00bfff;
}

.logo-text .subtitle {
	margin: 0;
	font-size: 0.8rem;
	color: #aaa;
}

/* 桌面导航菜单 */
.desktop-nav {
	display: block;
}

.nav-list {
	display: flex;
	gap: 30px;
	list-style: none;
	margin: 0;
	padding: 0;
}

.nav-item {
	position: relative;
	cursor: pointer;
	transition: all 0.3s ease;
}

.nav-link {
	color: #aaa;
	text-decoration: none;
	font-size: 1rem;
	transition: color 0.3s ease;
}

.nav-item:hover .nav-link {
	color: #00bfff;
}

.nav-item.active .nav-link {
	color: #00bfff;
	font-weight: bold;
}

.nav-item.active::after {
	content: "";
	position: absolute;
	bottom: -5px;
	left: 0;
	width: 100%;
	height: 2px;
	background: linear-gradient(45deg, #00bfff, #007acc);
	box-shadow: 0 0 10px rgba(0, 191, 255, 0.5);
}

/* 移动端菜单按钮 */
.mobile-menu-btn {
	display: none;
	background: rgba(0, 191, 255, 0.2);
	border: 1px solid rgba(0, 191, 255, 0.3);
	border-radius: 6px;
	color: #00bfff;
	width: 40px;
	height: 40px;
	cursor: pointer;
	transition: all 0.3s ease;
}

.mobile-menu-btn:hover {
	background: rgba(0, 191, 255, 0.3);
	box-shadow: 0 0 15px rgba(0, 191, 255, 0.4);
}

/* 移动端导航菜单 */
.mobile-menu {
	display: none;
	background: rgba(0, 25, 60, 0.95);
	border-bottom: 1px solid rgba(0, 191, 255, 0.3);
	backdrop-filter: blur(10px);
}

.mobile-nav-list {
	list-style: none;
	margin: 0;
	padding: 0;
}

.mobile-nav-item {
	padding: 15px 20px;
	border-bottom: 1px solid rgba(0, 191, 255, 0.1);
	cursor: pointer;
	transition: all 0.3s ease;
}

.mobile-nav-item:hover {
	background: rgba(0, 191, 255, 0.2);
}

.mobile-nav-item.active {
	background: rgba(0, 191, 255, 0.3);
	border-left: 4px solid #00bfff;
}

.mobile-nav-link {
	color: #fff;
	text-decoration: none;
	display: block;
	width: 100%;
	height: 100%;
}

/* 主内容区域 */
.app-main {
	flex: 1;
	max-width: 1400px;
	width: 100%;
	margin: 0 auto;
	padding: 20px;
	box-sizing: border-box;
}

/* 页脚 */
.app-footer {
	background: rgba(0, 25, 60, 0.9);
	border-top: 1px solid rgba(0, 191, 255, 0.3);
	backdrop-filter: blur(10px);
	margin-top: auto;
}

.footer-content {
	max-width: 1400px;
	margin: 0 auto;
	padding: 30px 20px;
	display: flex;
	flex-direction: column;
	align-items: center;
	text-align: center;
	gap: 20px;
}

.footer-info h3 {
	margin: 0;
	color: #00bfff;
	font-size: 1.2rem;
}

.footer-info p {
	margin: 5px 0 0 0;
	color: #aaa;
}

.footer-links {
	display: flex;
	gap: 20px;
	flex-wrap: wrap;
	justify-content: center;
}

.footer-links a {
	color: #aaa;
	text-decoration: none;
	transition: color 0.3s ease;
}

.footer-links a:hover {
	color: #00bfff;
}

.footer-copyright p {
	margin: 0;
	color: #666;
	font-size: 0.9rem;
}

/* 响应式设计 */
@media (max-width: 968px) {
	.desktop-nav {
		display: none;
	}

	.mobile-menu-btn {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.mobile-menu {
		display: block;
	}

	.logo-text h1 {
		font-size: 1.2rem;
	}

	.logo-text .subtitle {
		font-size: 0.7rem;
	}
}

@media (max-width: 480px) {
	.header-content {
		padding: 10px 15px;
	}

	.logo {
		gap: 10px;
	}

	.logo-icon {
		width: 40px;
		height: 40px;
	}

	.logo-text h1 {
		font-size: 1rem;
	}

	.logo-text .subtitle {
		display: none;
	}

	.app-main {
		padding: 15px;
	}
}
</style>
