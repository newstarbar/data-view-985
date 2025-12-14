<template>
	<div class="data-download-container">
		<!-- 页面标题 -->
		<section class="page-header">
			<h1 class="main-title">数据下载中心</h1>
			<p class="subtitle">3D筛选和专业导出工具，支持多种格式的数据导出</p>
		</section>

		<!-- 3D筛选面板 -->
		<section class="filter-panel-section">
			<div class="filter-card glass-card">
				<h2 class="section-title">3D筛选面板</h2>
				<div class="filter-content">
					<!-- 数据类型筛选 -->
					<div class="filter-group">
						<h3 class="filter-title">数据类型</h3>
						<div class="type-options">
							<div class="type-option" v-for="type in dataTypes" :key="type.id" :class="{ active: selectedDataType === type.id }" @click="selectDataType(type.id)">
								<span class="type-icon">{{ type.icon }}</span>
								<span class="type-name">{{ type.name }}</span>
							</div>
						</div>
					</div>

					<!-- 年份筛选 -->
					<div class="filter-group">
						<h3 class="filter-title">数据年份</h3>
						<div class="year-slider-container">
							<div class="year-labels">
								<span>2019</span>
								<span>2020</span>
								<span>2021</span>
								<span>2022</span>
								<span>2023</span>
								<span>2024</span>
							</div>
							<input type="range" v-model="selectedYear" min="2019" max="2024" step="1" class="year-slider" />
							<div class="selected-year">当前选择: {{ selectedYear }}</div>
						</div>
					</div>

					<!-- 3D开关选项 -->
					<div class="filter-group">
						<h3 class="filter-title">3D开关选项</h3>
						<div class="toggle-options">
							<div class="toggle-item" v-for="option in toggleOptions" :key="option.id">
								<span class="toggle-label">{{ option.name }}</span>
								<label class="toggle-switch">
									<input type="checkbox" v-model="option.value" @change="toggleOptionChange(option.id)" />
									<span class="slider"></span>
								</label>
							</div>
						</div>
					</div>

					<!-- 搜索框 -->
					<div class="filter-group">
						<h3 class="filter-title">关键词搜索</h3>
						<div class="search-container">
							<input type="text" v-model="searchKeyword" placeholder="搜索数据名称、代码..." class="search-input" />
							<button class="search-btn">
								<span class="search-icon">🔍</span>
							</button>
						</div>
					</div>

					<!-- 重置按钮 -->
					<button class="reset-btn" @click="resetFilters">
						<span class="reset-icon">🔄</span>
						重置筛选条件
					</button>
				</div>
			</div>
		</section>

		<!-- 数据列表 -->
		<section class="data-list-section">
			<div class="list-header">
				<h2 class="section-title">数据列表</h2>
				<div class="list-stats">
					<span>共 {{ filteredDataList.length }} 条数据</span>
				</div>
			</div>

			<div class="data-list">
				<div v-for="item in filteredDataList" :key="item.id" class="data-item glass-card" @click="openDataPreview(item)">
					<div class="data-item-header">
						<div class="data-item-info">
							<h3 class="data-item-title">{{ item.name }}</h3>
							<p class="data-item-desc">{{ item.description }}</p>
						</div>
						<div class="data-item-meta">
							<span class="data-type">{{ item.dataType }}</span>
							<span class="data-year">{{ item.year }}</span>
						</div>
					</div>
					<div class="data-item-content">
						<div class="data-details">
							<div class="detail-item">
								<span class="detail-label">数据量:</span>
								<span class="detail-value">{{ item.dataCount }}</span>
							</div>
							<div class="detail-item">
								<span class="detail-label">更新时间:</span>
								<span class="detail-value">{{ item.updateTime }}</span>
							</div>
							<div class="detail-item">
								<span class="detail-label">数据格式:</span>
								<span class="detail-value">{{ item.format }}</span>
							</div>
						</div>
						<div class="data-export-btn-container">
							<button class="export-btn" @click.stop="exportData(item)">
								<span class="export-icon">📥</span>
								导出
							</button>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- 数据预览弹窗 -->
		<div v-if="showPreviewModal" class="modal-overlay" @click="closePreviewModal">
			<div class="modal-content" @click.stop>
				<div class="modal-header">
					<h2 class="modal-title">{{ previewData?.name }} - 数据预览</h2>
					<button class="close-btn" @click="closePreviewModal">×</button>
				</div>
				<div class="modal-body">
					<div class="preview-chart-container">
						<div ref="previewChart" class="preview-chart"></div>
					</div>
					<div class="preview-info">
						<h3 class="info-title">数据详情</h3>
						<div class="info-list">
							<div class="info-item">
								<span class="info-label">数据描述:</span>
								<span class="info-value">{{ previewData?.description }}</span>
							</div>
							<div class="info-item">
								<span class="info-label">数据类型:</span>
								<span class="info-value">{{ previewData?.dataType }}</span>
							</div>
							<div class="info-item">
								<span class="info-label">年份:</span>
								<span class="info-value">{{ previewData?.year }}</span>
							</div>
							<div class="info-item">
								<span class="info-label">数据量:</span>
								<span class="info-value">{{ previewData?.dataCount }}</span>
							</div>
							<div class="info-item">
								<span class="info-label">更新时间:</span>
								<span class="info-value">{{ previewData?.updateTime }}</span>
							</div>
							<div class="info-item">
								<span class="info-label">数据格式:</span>
								<span class="info-value">{{ previewData?.format }}</span>
							</div>
						</div>
						<div class="preview-export-btns">
							<button class="preview-export-btn" @click="exportData(previewData!, 'png')">
								<span class="btn-icon">🖼️</span>
								导出PNG(高清)
							</button>
							<button class="preview-export-btn" @click="exportData(previewData!, 'excel')">
								<span class="btn-icon">📊</span>
								导出Excel
							</button>
							<button class="preview-export-btn" @click="exportData(previewData!, 'json')">
								<span class="btn-icon">📄</span>
								导出JSON
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- 导出进度弹窗 -->
		<div v-if="showExportProgress" class="modal-overlay">
			<div class="modal-content export-progress-modal">
				<div class="progress-header">
					<h2 class="modal-title">数据导出中</h2>
				</div>
				<div class="progress-body">
					<div class="export-animation">
						<div class="particle-container">
							<div
								v-for="i in 10"
								:key="i"
								class="export-particle"
								:style="{
									animationDelay: `${i * 0.1}s`,
									left: `${50 + Math.random() * 40 - 20}%`,
									top: `${50 + Math.random() * 40 - 20}%`
								}"
							></div>
						</div>
						<div class="progress-bar-container">
							<div class="progress-bar">
								<div class="progress-fill" :style="{ width: exportProgress + '%' }"></div>
							</div>
							<div class="progress-text">{{ exportProgress }}%</div>
						</div>
					</div>
					<div class="export-info">
						<p>{{ exportMessage }}</p>
					</div>
				</div>
			</div>
		</div>

		<!-- 导出成功提示 -->
		<div v-if="showExportSuccess" class="success-toast">
			<div class="success-content">
				<span class="success-icon">🎉</span>
				<span class="success-text">{{ exportSuccessMessage }}</span>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import * as echarts from "echarts";

// 数据类型
const dataTypes = ref([
	{ id: 1, name: "高校招生数据", icon: "🏫" },
	{ id: 2, name: "专业录取数据", icon: "📚" },
	{ id: 3, name: "就业深造数据", icon: "💼" },
	{ id: 4, name: "招生政策数据", icon: "📜" },
	{ id: 5, name: "学科评估数据", icon: "🏆" },
	{ id: 6, name: "院校排名数据", icon: "📊" }
]);

// 筛选条件
const selectedDataType = ref(0); // 0表示全部
const selectedYear = ref(2024);
const searchKeyword = ref("");

// 3D开关选项
const toggleOptions = ref([
	{ id: 1, name: "包含历史数据", value: true },
	{ id: 2, name: "包含详细指标", value: false },
	{ id: 3, name: "包含可视化图表", value: true },
	{ id: 4, name: "包含统计分析", value: false }
]);

// 数据列表
const dataList = ref([
	{
		id: 1,
		name: "2024年985高校招生计划",
		description: "包含39所985高校的招生计划、专业设置和录取规则",
		dataType: "高校招生数据",
		year: 2024,
		dataCount: "1200+条",
		updateTime: "2024-06-15",
		format: "Excel/JSON/CSV",
		chartData: {
			type: "bar",
			categories: ["清华大学", "北京大学", "浙江大学", "上海交通大学", "复旦大学"],
			data: [850, 800, 950, 880, 820]
		}
	},
	{
		id: 2,
		name: "2024年专业录取分数线",
		description: "各专业的录取分数线、位次和录取比例",
		dataType: "专业录取数据",
		year: 2024,
		dataCount: "5000+条",
		updateTime: "2024-07-20",
		format: "Excel/JSON/CSV",
		chartData: {
			type: "line",
			categories: ["计算机", "电子", "金融", "医学", "机械"],
			data: [680, 675, 670, 665, 660]
		}
	},
	{
		id: 3,
		name: "2023年就业质量报告",
		description: "各高校毕业生的就业去向、薪资水平和就业质量",
		dataType: "就业深造数据",
		year: 2023,
		dataCount: "3000+条",
		updateTime: "2024-03-10",
		format: "Excel/JSON/PDF",
		chartData: {
			type: "pie",
			categories: ["互联网", "金融", "教育", "科研", "其他"],
			data: [35, 25, 15, 15, 10]
		}
	},
	{
		id: 4,
		name: "2024年招生政策汇编",
		description: "各高校的招生政策、专项计划和加分政策",
		dataType: "招生政策数据",
		year: 2024,
		dataCount: "500+条",
		updateTime: "2024-04-25",
		format: "PDF/JSON/HTML",
		chartData: {
			type: "bar",
			categories: ["强基计划", "综合评价", "专项计划", "普通招生"],
			data: [1200, 2800, 3500, 15000]
		}
	},
	{
		id: 5,
		name: "第五轮学科评估结果",
		description: "各高校学科的评估结果和排名",
		dataType: "学科评估数据",
		year: 2023,
		dataCount: "1500+条",
		updateTime: "2024-02-18",
		format: "Excel/JSON/CSV",
		chartData: {
			type: "bar",
			categories: ["A+", "A", "A-", "B+", "B"],
			data: [120, 280, 350, 450, 300]
		}
	},
	{
		id: 6,
		name: "2024年中国大学排名",
		description: "包含985高校的综合排名和单项排名",
		dataType: "院校排名数据",
		year: 2024,
		dataCount: "300+条",
		updateTime: "2024-01-30",
		format: "Excel/JSON/HTML",
		chartData: {
			type: "line",
			categories: ["清华大学", "北京大学", "浙江大学", "上海交通大学", "复旦大学", "南京大学", "中国科学技术大学"],
			data: [1, 2, 3, 4, 5, 6, 7]
		}
	},
	{
		id: 7,
		name: "2020-2024年招生趋势分析",
		description: "近5年的招生计划、录取分数和报考人数趋势",
		dataType: "高校招生数据",
		year: "2020-2024",
		dataCount: "8000+条",
		updateTime: "2024-05-10",
		format: "Excel/JSON/CSV",
		chartData: {
			type: "line",
			categories: ["2020", "2021", "2022", "2023", "2024"],
			data: [45000, 46000, 47000, 48000, 49000]
		}
	},
	{
		id: 8,
		name: "2023年毕业生深造质量报告",
		description: "各高校毕业生的深造率、海外留学情况和深造院校",
		dataType: "就业深造数据",
		year: 2023,
		dataCount: "2500+条",
		updateTime: "2024-04-05",
		format: "Excel/JSON/PDF",
		chartData: {
			type: "pie",
			categories: ["国内深造", "海外留学", "就业", "创业"],
			data: [55, 15, 25, 5]
		}
	}
]);

// 筛选后的数据列表
const filteredDataList = computed(() => {
	return dataList.value.filter((item) => {
		// 数据类型筛选
		if (selectedDataType.value !== 0 && item.dataType !== dataTypes.value.find((t) => t.id === selectedDataType.value)?.name) {
			return false;
		}
		// 年份筛选
		if (selectedYear.value !== 0 && item.year !== selectedYear.value && item.year !== `2020-${selectedYear.value}`) {
			return false;
		}
		// 关键词搜索
		if (
			searchKeyword.value &&
			!item.name.toLowerCase().includes(searchKeyword.value.toLowerCase()) &&
			!item.description.toLowerCase().includes(searchKeyword.value.toLowerCase()) &&
			!item.dataType.toLowerCase().includes(searchKeyword.value.toLowerCase())
		) {
			return false;
		}
		return true;
	});
});

// 选择数据类型
const selectDataType = (typeId: number) => {
	selectedDataType.value = typeId;
};

// 切换选项变更
const toggleOptionChange = (optionId: number) => {
	const option = toggleOptions.value.find((opt) => opt.id === optionId);
	if (option) {
		option.value = !option.value;
	}
};

// 重置筛选条件
const resetFilters = () => {
	selectedDataType.value = 0;
	selectedYear.value = 2024;
	searchKeyword.value = "";
	toggleOptions.value.forEach((opt) => (opt.value = false));
	toggleOptions.value[0].value = true; // 默认包含历史数据
	toggleOptions.value[2].value = true; // 默认包含可视化图表
};

// 数据预览
const showPreviewModal = ref(false);
const previewData = ref<any>(null);
const previewChart = ref<HTMLElement | null>(null);
let previewChartInstance: echarts.ECharts | null = null;
let progressInterval: number | null = null;

// 打开数据预览
const openPreviewModal = () => {
	showPreviewModal.value = true;
	// 延迟初始化图表，确保DOM已渲染
	setTimeout(() => {
		initPreviewChart();
	}, 100);
};

// 关闭数据预览
const closePreviewModal = () => {
	showPreviewModal.value = false;
	previewData.value = null;
	if (previewChartInstance) {
		previewChartInstance.dispose();
		previewChartInstance = null;
	}
};

// 打开数据预览
const openDataPreview = (data: any) => {
	previewData.value = data;
	openPreviewModal();
};

// 初始化预览图表
const initPreviewChart = () => {
	if (!previewChart.value || !previewData.value) return;

	previewChartInstance = echarts.init(previewChart.value);

	const chartData = previewData.value.chartData;
	let option: echarts.EChartsOption = {};

	switch (chartData.type) {
		case "bar":
			option = {
				backgroundColor: "transparent",
				tooltip: {
					trigger: "axis",
					backgroundColor: "rgba(10, 14, 23, 0.9)",
					borderColor: "#40C4FF",
					borderWidth: 1,
					textStyle: {
						color: "#fff"
					}
				},
				grid: {
					left: "3%",
					right: "4%",
					bottom: "3%",
					containLabel: true
				},
				xAxis: {
					type: "category",
					data: chartData.categories,
					axisLabel: {
						color: "#fff",
						rotate: 45
					},
					axisLine: {
						lineStyle: {
							color: "#40C4FF"
						}
					},
					splitLine: {
						show: false
					}
				},
				yAxis: {
					type: "value",
					axisLabel: {
						color: "#fff"
					},
					axisLine: {
						lineStyle: {
							color: "#40C4FF"
						}
					},
					splitLine: {
						lineStyle: {
							color: "rgba(64, 196, 255, 0.1)"
						}
					}
				},
				series: [
					{
						name: "数据",
						type: "bar",
						data: chartData.data,
						itemStyle: {
							color: "#40C4FF",
							opacity: 0.8,
							borderWidth: 1,
							borderColor: "#fff"
						},
						emphasis: {
							itemStyle: {
								opacity: 1,
								borderWidth: 2
							}
						}
					}
				]
			};
			break;

		case "line":
			option = {
				backgroundColor: "transparent",
				tooltip: {
					trigger: "axis",
					backgroundColor: "rgba(10, 14, 23, 0.9)",
					borderColor: "#40C4FF",
					borderWidth: 1,
					textStyle: {
						color: "#fff"
					}
				},
				grid: {
					left: "3%",
					right: "4%",
					bottom: "3%",
					containLabel: true
				},
				xAxis: {
					type: "category",
					data: chartData.categories,
					axisLabel: {
						color: "#fff",
						rotate: 45
					},
					axisLine: {
						lineStyle: {
							color: "#40C4FF"
						}
					},
					splitLine: {
						show: false
					}
				},
				yAxis: {
					type: "value",
					axisLabel: {
						color: "#fff"
					},
					axisLine: {
						lineStyle: {
							color: "#40C4FF"
						}
					},
					splitLine: {
						lineStyle: {
							color: "rgba(64, 196, 255, 0.1)"
						}
					}
				},
				series: [
					{
						name: "数据",
						type: "line",
						data: chartData.data,
						smooth: true,
						lineStyle: {
							color: "#40C4FF",
							width: 3
						},
						areaStyle: {
							color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
								{ offset: 0, color: "rgba(64, 196, 255, 0.5)" },
								{ offset: 1, color: "rgba(64, 196, 255, 0.1)" }
							])
						},
						itemStyle: {
							color: "#00E5FF",
							opacity: 0.8,
							borderWidth: 2,
							borderColor: "#fff"
						},
						emphasis: {
							itemStyle: {
								opacity: 1,
								borderWidth: 3
							}
						},
						symbolSize: 8
					}
				]
			};
			break;

		case "pie":
			option = {
				backgroundColor: "transparent",
				tooltip: {
					trigger: "item",
					formatter: "{b}: {c}%",
					backgroundColor: "rgba(10, 14, 23, 0.9)",
					borderColor: "#40C4FF",
					borderWidth: 1,
					textStyle: {
						color: "#fff"
					}
				},
				legend: {
					orient: "vertical",
					right: 10,
					top: "center",
					data: chartData.categories,
					textStyle: {
						color: "#fff"
					}
				},
				series: [
					{
						name: "数据",
						type: "pie",
						radius: ["40%", "70%"],
						center: ["40%", "50%"],
						avoidLabelOverlap: false,
						itemStyle: {
							color: function (params: any) {
								const colors = ["#1E88E5", "#40C4FF", "#00E5FF", "#80D8FF", "#00B8D4", "#29B6F6", "#039BE5", "#1976D2"];
								return colors[params.dataIndex % colors.length];
							},
							opacity: 0.8,
							borderWidth: 1,
							borderColor: "#fff"
						},
						label: {
							show: false,
							position: "center"
						},
						emphasis: {
							itemStyle: {
								opacity: 1,
								borderWidth: 2
							},
							label: {
								show: true,
								fontSize: 20,
								fontWeight: "bold",
								color: "#fff"
							}
						},
						labelLine: {
							show: false
						},
						data: chartData.categories.map((category: string, index: number) => ({
							value: chartData.data[index],
							name: category
						}))
					}
				]
			};
			break;
	}

	previewChartInstance.setOption(option);
};

// 导出数据
const showExportProgress = ref(false);
const exportProgress = ref(0);
const exportMessage = ref("");
const showExportSuccess = ref(false);
const exportSuccessMessage = ref("");

// 模拟导出数据
const exportData = (data: any, format: string = "Excel") => {
	showExportProgress.value = true;
	exportProgress.value = 0;
	exportMessage.value = `正在导出 ${data.name} (${format})...`;

	// 模拟导出进度
	if (progressInterval) {
		clearInterval(progressInterval);
	}
	progressInterval = setInterval(() => {
		exportProgress.value += 10;
		if (exportProgress.value >= 100) {
			clearInterval(progressInterval!);
			progressInterval = null;
			setTimeout(() => {
				showExportProgress.value = false;
				showExportSuccess.value = true;
				exportSuccessMessage.value = `${data.name} 已成功导出为 ${format} 格式！`;
				// 3秒后关闭成功提示
				setTimeout(() => {
					showExportSuccess.value = false;
				}, 3000);
			}, 500);
		}
	}, 200);
};

// 监听窗口大小变化
const handleResize = () => {
	previewChartInstance?.resize();
};

// 生命周期钩子
onMounted(() => {
	window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
	window.removeEventListener("resize", handleResize);
	if (previewChartInstance) {
		previewChartInstance.dispose();
		previewChartInstance = null;
	}
	// 清除所有定时器
	if (progressInterval) {
		clearInterval(progressInterval);
		progressInterval = null;
	}
});
</script>

<style scoped>
.data-download-container {
	max-width: 1400px;
	margin: 0 auto;
	padding: 0 2rem;
}

/* 页面标题 */
.page-header {
	text-align: center;
	margin-bottom: 3rem;
}

.main-title {
	font-size: 2.5rem;
	color: var(--text-primary);
	margin-bottom: 0.5rem;
	text-shadow: 0 0 20px rgba(64, 196, 255, 0.5);
}

.subtitle {
	font-size: 1.1rem;
	color: var(--text-secondary);
	margin: 0;
}

/* 3D筛选面板 */
.filter-panel-section {
	margin-bottom: 3rem;
}

.filter-card {
	padding: 2rem;
	border-radius: 16px;
}

.section-title {
	font-size: 1.8rem;
	margin-bottom: 1.5rem;
	color: var(--text-primary);
	text-align: center;
	text-shadow: 0 0 10px rgba(64, 196, 255, 0.5);
	position: relative;
}

.section-title::after {
	content: "";
	position: absolute;
	bottom: -5px;
	left: 50%;
	transform: translateX(-50%);
	width: 80px;
	height: 2px;
	background: linear-gradient(90deg, transparent, var(--primary-light), transparent);
}

.filter-content {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
	gap: 2rem;
}

.filter-group {
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

.filter-title {
	font-size: 1.2rem;
	color: var(--text-primary);
	margin: 0;
	font-weight: bold;
}

/* 数据类型选项 */
.type-options {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
	gap: 1rem;
}

.type-option {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.5rem;
	padding: 1rem;
	background: rgba(64, 196, 255, 0.1);
	border: 1px solid rgba(64, 196, 255, 0.3);
	border-radius: 12px;
	cursor: pointer;
	transition: all 0.3s ease;
	min-width: 100px;
}

.type-option:hover {
	background: rgba(64, 196, 255, 0.2);
	transform: translateY(-2px);
	box-shadow: 0 5px 15px rgba(64, 196, 255, 0.3);
}

.type-option.active {
	background: var(--primary-gradient);
	border-color: var(--primary-light);
	box-shadow: 0 0 20px rgba(64, 196, 255, 0.5);
}

.type-icon {
	font-size: 2rem;
}

.type-name {
	font-size: 1rem;
	font-weight: bold;
	color: var(--text-primary);
	text-align: center;
}

.type-option.active .type-name {
	color: white;
}

/* 年份滑块 */
.year-slider-container {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}

.year-labels {
	display: flex;
	justify-content: space-between;
	color: var(--text-secondary);
	font-size: 0.9rem;
}

.year-slider {
	-webkit-appearance: none;
	width: 100%;
	height: 6px;
	border-radius: 3px;
	background: rgba(64, 196, 255, 0.3);
	outline: none;
	transition: background 0.3s ease;
}

.year-slider:hover {
	background: rgba(64, 196, 255, 0.5);
}

.year-slider::-webkit-slider-thumb {
	-webkit-appearance: none;
	appearance: none;
	width: 20px;
	height: 20px;
	border-radius: 50%;
	background: var(--primary-light);
	cursor: pointer;
	box-shadow: 0 0 10px rgba(64, 196, 255, 0.8);
	transition: all 0.3s ease;
}

.year-slider::-webkit-slider-thumb:hover {
	transform: scale(1.2);
	box-shadow: 0 0 15px rgba(64, 196, 255, 1);
}

.selected-year {
	font-size: 1rem;
	color: var(--primary-light);
	font-weight: bold;
	text-align: center;
}

/* 开关选项 */
.toggle-options {
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

.toggle-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.toggle-label {
	font-size: 1rem;
	color: var(--text-primary);
}

/* 开关样式 */
.toggle-switch {
	position: relative;
	display: inline-block;
	width: 50px;
	height: 24px;
}

.toggle-switch input {
	opacity: 0;
	width: 0;
	height: 0;
}

.slider {
	position: absolute;
	cursor: pointer;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(64, 196, 255, 0.2);
	transition: 0.4s;
	border-radius: 34px;
	border: 1px solid rgba(64, 196, 255, 0.5);
}

.slider:before {
	position: absolute;
	content: "";
	height: 18px;
	width: 18px;
	left: 3px;
	bottom: 2px;
	background-color: white;
	transition: 0.4s;
	border-radius: 50%;
	box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
}

input:checked + .slider {
	background-color: var(--primary-light);
	box-shadow: 0 0 10px rgba(64, 196, 255, 0.8);
}

input:checked + .slider:before {
	transform: translateX(26px);
}

/* 搜索框 */
.search-container {
	position: relative;
	display: flex;
	gap: 0.5rem;
}

.search-input {
	flex: 1;
	padding: 0.75rem 1rem;
	border: 1px solid rgba(64, 196, 255, 0.3);
	border-radius: 25px;
	background: rgba(64, 196, 255, 0.1);
	color: var(--text-primary);
	font-size: 1rem;
	transition: all 0.3s ease;
}

.search-input:focus {
	outline: none;
	border-color: var(--primary-light);
	box-shadow: 0 0 10px rgba(64, 196, 255, 0.3);
	background: rgba(64, 196, 255, 0.15);
}

.search-btn {
	padding: 0.75rem 1rem;
	background: var(--primary-gradient);
	border: none;
	border-radius: 25px;
	cursor: pointer;
	transition: all 0.3s ease;
	display: flex;
	align-items: center;
	justify-content: center;
	color: white;
}

.search-btn:hover {
	transform: translateY(-2px);
	box-shadow: 0 5px 15px rgba(64, 196, 255, 0.5);
}

.search-icon {
	font-size: 1.2rem;
}

/* 重置按钮 */
.reset-btn {
	background: rgba(255, 87, 34, 0.1);
	border: 1px solid rgba(255, 87, 34, 0.3);
	border-radius: 25px;
	padding: 0.75rem 1.5rem;
	color: var(--text-primary);
	cursor: pointer;
	transition: all 0.3s ease;
	font-weight: 500;
	display: flex;
	align-items: center;
	gap: 0.5rem;
	justify-content: center;
	margin-top: 1rem;
}

.reset-btn:hover {
	background: rgba(255, 87, 34, 0.2);
	transform: translateY(-2px);
	box-shadow: 0 5px 15px rgba(255, 87, 34, 0.3);
}

.reset-icon {
	font-size: 1.2rem;
}

/* 数据列表 */
.data-list-section {
	margin-bottom: 3rem;
}

.list-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 1.5rem;
}

.list-stats {
	font-size: 1.1rem;
	color: var(--text-secondary);
}

.data-list {
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
}

.data-item {
	padding: 1.5rem;
	border-radius: 16px;
	cursor: pointer;
	transition: all 0.3s ease;
	border: 1px solid rgba(64, 196, 255, 0.3);
}

.data-item:hover {
	transform: translateY(-5px);
	box-shadow: 0 10px 25px rgba(64, 196, 255, 0.4);
	border-color: var(--primary-light);
}

.data-item-header {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	margin-bottom: 1rem;
}

.data-item-info {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}

.data-item-title {
	font-size: 1.5rem;
	color: var(--text-primary);
	margin: 0;
	font-weight: bold;
}

.data-item-desc {
	font-size: 1rem;
	color: var(--text-secondary);
	margin: 0;
	line-height: 1.5;
}

.data-item-meta {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	align-items: flex-end;
}

.data-type {
	padding: 0.25rem 0.75rem;
	background: var(--primary-gradient);
	color: white;
	border-radius: 15px;
	font-size: 0.8rem;
	font-weight: bold;
}

.data-year {
	padding: 0.25rem 0.75rem;
	background: rgba(64, 196, 255, 0.2);
	color: var(--primary-light);
	border-radius: 15px;
	font-size: 0.8rem;
	font-weight: bold;
}

.data-item-content {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.data-details {
	display: flex;
	gap: 2rem;
	flex-wrap: wrap;
}

.detail-item {
	display: flex;
	gap: 0.5rem;
	align-items: center;
}

.detail-label {
	font-size: 0.9rem;
	color: var(--text-secondary);
}

.detail-value {
	font-size: 0.9rem;
	color: var(--text-primary);
	font-weight: bold;
}

.data-export-btn-container {
	display: flex;
	justify-content: flex-end;
}

.export-btn {
	padding: 0.75rem 1.5rem;
	background: var(--primary-gradient);
	border: none;
	border-radius: 25px;
	cursor: pointer;
	transition: all 0.3s ease;
	display: flex;
	align-items: center;
	gap: 0.5rem;
	color: white;
	font-size: 1rem;
	font-weight: bold;
}

.export-btn:hover {
	transform: translateY(-2px);
	box-shadow: 0 5px 15px rgba(64, 196, 255, 0.5);
}

.export-icon {
	font-size: 1.2rem;
}

/* 弹窗样式 */
.modal-overlay {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.8);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 1000;
	backdrop-filter: blur(5px);
}

.modal-content {
	background: var(--glass-background);
	border: 1px solid var(--glass-border);
	border-radius: 20px;
	padding: 2rem;
	width: 90%;
	max-width: 800px;
	max-height: 80vh;
	overflow-y: auto;
	box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
}

.modal-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 2rem;
	padding-bottom: 1rem;
	border-bottom: 1px solid rgba(64, 196, 255, 0.3);
}

.modal-title {
	font-size: 1.8rem;
	color: var(--text-primary);
	margin: 0;
	font-weight: bold;
}

.close-btn {
	background: none;
	border: none;
	font-size: 2rem;
	color: var(--text-primary);
	cursor: pointer;
	padding: 0;
	width: 40px;
	height: 40px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 50%;
	transition: all 0.3s ease;
}

.close-btn:hover {
	background: rgba(255, 87, 34, 0.1);
	color: #ff5722;
	transform: rotate(90deg);
}

.modal-body {
	display: flex;
	flex-direction: column;
	gap: 2rem;
}

/* 预览图表 */
.preview-chart-container {
	display: flex;
	justify-content: center;
	align-items: center;
}

.preview-chart {
	width: 100%;
	height: 400px;
	border-radius: 12px;
	overflow: hidden;
}

/* 预览信息 */
.preview-info {
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
}

.info-title {
	font-size: 1.5rem;
	color: var(--text-primary);
	margin: 0;
	font-weight: bold;
}

.info-list {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
	gap: 1rem;
}

.info-item {
	display: flex;
	flex-direction: column;
	gap: 0.25rem;
	padding: 1rem;
	background: rgba(64, 196, 255, 0.1);
	border-radius: 8px;
}

.info-label {
	font-size: 0.9rem;
	color: var(--text-secondary);
	font-weight: bold;
}

.info-value {
	font-size: 1rem;
	color: var(--text-primary);
}

/* 预览导出按钮 */
.preview-export-btns {
	display: flex;
	gap: 1rem;
	flex-wrap: wrap;
	justify-content: center;
}

.preview-export-btn {
	padding: 1rem 2rem;
	background: var(--primary-gradient);
	border: none;
	border-radius: 25px;
	cursor: pointer;
	transition: all 0.3s ease;
	display: flex;
	align-items: center;
	gap: 0.5rem;
	color: white;
	font-size: 1rem;
	font-weight: bold;
	min-width: 150px;
	justify-content: center;
}

.preview-export-btn:hover {
	transform: translateY(-2px);
	box-shadow: 0 5px 15px rgba(64, 196, 255, 0.5);
}

.btn-icon {
	font-size: 1.2rem;
}

/* 导出进度弹窗 */
.export-progress-modal {
	max-width: 500px;
}

.progress-body {
	display: flex;
	flex-direction: column;
	gap: 2rem;
	align-items: center;
}

.export-animation {
	position: relative;
	width: 200px;
	height: 200px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: 2rem;
}

.particle-container {
	position: relative;
	width: 150px;
	height: 150px;
	border-radius: 50%;
	overflow: hidden;
}

.export-particle {
	position: absolute;
	width: 10px;
	height: 10px;
	background: var(--primary-light);
	border-radius: 50%;
	animation: particleFloat 2s infinite ease-in-out;
	opacity: 0.8;
	box-shadow: 0 0 10px rgba(64, 196, 255, 0.8);
}

@keyframes particleFloat {
	0%,
	100% {
		transform: translateY(0) scale(1);
		opacity: 0.8;
	}
	50% {
		transform: translateY(-20px) scale(1.2);
		opacity: 1;
	}
}

.progress-bar-container {
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}

.progress-bar {
	width: 100%;
	height: 10px;
	background: rgba(64, 196, 255, 0.2);
	border-radius: 5px;
	overflow: hidden;
	border: 1px solid rgba(64, 196, 255, 0.5);
}

.progress-fill {
	height: 100%;
	background: var(--primary-gradient);
	border-radius: 5px;
	transition: width 0.3s ease;
	box-shadow: 0 0 10px rgba(64, 196, 255, 0.8);
}

.progress-text {
	text-align: center;
	font-size: 1.2rem;
	color: var(--primary-light);
	font-weight: bold;
}

/* 导出成功提示 */
.success-toast {
	position: fixed;
	bottom: 2rem;
	right: 2rem;
	background: var(--success-background);
	border: 1px solid var(--success-border);
	border-radius: 15px;
	padding: 1rem 1.5rem;
	box-shadow: 0 10px 20px rgba(0, 128, 0, 0.3);
	display: flex;
	align-items: center;
	gap: 1rem;
	z-index: 1001;
	animation: toastSlideIn 0.5s ease-out;
}

@keyframes toastSlideIn {
	from {
		transform: translateX(100%);
		opacity: 0;
	}
	to {
		transform: translateX(0);
		opacity: 1;
	}
}

.success-content {
	display: flex;
	align-items: center;
	gap: 1rem;
}

.success-icon {
	font-size: 1.5rem;
}

.success-text {
	font-size: 1rem;
	color: white;
	font-weight: bold;
}

/* 响应式设计 */
@media (max-width: 768px) {
	.data-download-container {
		padding: 0 1rem;
	}

	.main-title {
		font-size: 2rem;
	}

	.filter-content {
		grid-template-columns: 1fr;
	}

	.data-item-header {
		flex-direction: column;
		align-items: flex-start;
		gap: 1rem;
	}

	.data-item-meta {
		align-items: flex-start;
	}

	.data-item-content {
		flex-direction: column;
		align-items: flex-start;
		gap: 1rem;
	}

	.data-details {
		flex-direction: column;
		align-items: flex-start;
		gap: 1rem;
	}

	.data-export-btn-container {
		width: 100%;
	}

	.export-btn {
		width: 100%;
		justify-content: center;
	}

	.modal-content {
		width: 95%;
		padding: 1.5rem;
	}

	.preview-chart {
		height: 300px;
	}

	.info-list {
		grid-template-columns: 1fr;
	}

	.preview-export-btns {
		flex-direction: column;
	}

	.preview-export-btn {
		width: 100%;
	}

	.success-toast {
		bottom: 1rem;
		right: 1rem;
		left: 1rem;
		text-align: center;
	}
}
</style>
