<template>
	<div class="university-analysis-container">
		<!-- 页面标题 -->
		<section class="page-header">
			<h1 class="main-title">高校多维度对比分析</h1>
			<p class="subtitle">3D可视化展示各985高校的综合实力、招生情况和就业质量</p>
		</section>

		<!-- 主内容区域 - 左右分布 -->
		<div class="main-content">
			<!-- 3D高校选择器 -->
			<section class="university-selector-section">
				<div class="selector-card glass-card">
					<h2 class="section-title">3D高校选择器</h2>
					<div class="selector-content">
						<div class="search-container">
							<div class="search-box">
								<span class="search-icon">🔍</span>
								<input type="text" v-model="searchQuery" placeholder="搜索高校..." class="search-input" />
							</div>
						</div>

						<!-- 3D高校列表 -->
						<div class="university-list-container">
							<div
								class="university-item"
								v-for="university in filteredUniversities"
								:key="university.id"
								:class="{ selected: selectedUniversityIds.includes(university.id) }"
								@click="toggleUniversitySelection(university.id)"
							>
								<div class="university-logo">
									<div class="logo-placeholder" :style="{ backgroundColor: university.color }">{{ university.logo }}</div>
								</div>
								<div class="university-info">
									<div class="university-name">{{ university.name }}</div>
									<div class="university-location">{{ university.location }}</div>
								</div>
								<div class="selection-indicator">
									<span v-if="selectedUniversityIds.includes(university.id)">✓</span>
								</div>
							</div>
						</div>

						<!-- 已选高校标签 -->
						<div class="selected-universities">
							<div class="selected-tag" v-for="id in selectedUniversityIds" :key="id">
								<span class="tag-text">{{ getUniversityName(id) }}</span>
								<button class="tag-remove" @click.stop="removeUniversitySelection(id)">×</button>
							</div>
							<div class="selection-limit" v-if="selectedUniversityIds.length >= 5">最多可选择5所高校</div>
						</div>
					</div>
				</div>
			</section>

			<!-- 四大联动分析模块 -->
			<section class="analysis-modules-section">
				<div class="module-card glass-card">
					<h3 class="module-title">
						<span class="module-icon">📊</span>
						多高校综合实力3D雷达图
					</h3>
					<div class="module-content">
						<div ref="radarChart" class="chart-canvas"></div>
					</div>
				</div>

				<div class="module-card glass-card">
					<h3 class="module-title">
						<span class="module-icon">📈</span>
						核心指标动态对比图
					</h3>
					<div class="module-controls">
						<button class="control-btn" :class="{ active: chartType === 'bar' }" @click="chartType = 'bar'">3D柱状图</button>
						<button class="control-btn" :class="{ active: chartType === 'line' }" @click="chartType = 'line'">曲面折线图</button>
					</div>
					<div class="module-content">
						<div ref="comparisonChart" class="chart-canvas"></div>
					</div>
				</div>

				<div class="module-card glass-card">
					<h3 class="module-title">
						<span class="module-icon">🗺️</span>
						分省招生与录取3D柱状图
					</h3>
					<div class="module-content">
						<div ref="provinceChart" class="chart-canvas"></div>
					</div>
				</div>

				<div class="module-card glass-card">
					<h3 class="module-title">
						<span class="module-icon">🔄</span>
						生源结构组合图
					</h3>
					<div class="module-content">
						<div class="combination-chart">
							<div ref="ringChart" class="chart-half"></div>
							<div ref="histogramChart" class="chart-half"></div>
						</div>
					</div>
				</div>
			</section>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import echarts from "../utils/echarts";
import type { EChartsCoreOption } from "../utils/echarts";

// 搜索查询
const searchQuery = ref("");

// 图表类型
const chartType = ref("bar");

// 高校数据
const universities = ref([
	{ id: 1, name: "清华大学", logo: "清", location: "北京", color: "#FF6B6B" },
	{ id: 2, name: "北京大学", logo: "北", location: "北京", color: "#4ECDC4" },
	{ id: 3, name: "复旦大学", logo: "复", location: "上海", color: "#45B7D1" },
	{ id: 4, name: "上海交通大学", logo: "上交", location: "上海", color: "#96CEB4" },
	{ id: 5, name: "浙江大学", logo: "浙", location: "浙江", color: "#FFEAA7" },
	{ id: 6, name: "南京大学", logo: "南", location: "江苏", color: "#DDA0DD" },
	{ id: 7, name: "中国科学技术大学", logo: "中科大", location: "安徽", color: "#98D8C8" },
	{ id: 8, name: "哈尔滨工业大学", logo: "哈工大", location: "黑龙江", color: "#F7DC6F" },
	{ id: 9, name: "西安交通大学", logo: "西交", location: "陕西", color: "#BB8FCE" },
	{ id: 10, name: "武汉大学", logo: "武大", location: "湖北", color: "#85C1E2" }
]);

// 已选高校ID
const selectedUniversityIds = ref([1, 2, 3]);

// 筛选后的高校列表
const filteredUniversities = computed(() => {
	if (!searchQuery.value) return universities.value;
	return universities.value.filter(
		(university) => university.name.toLowerCase().includes(searchQuery.value.toLowerCase()) || university.location.toLowerCase().includes(searchQuery.value.toLowerCase())
	);
});

// 根据ID获取高校名称
const getUniversityName = (id: number) => {
	const university = universities.value.find((u) => u.id === id);
	return university ? university.name : "";
};

// 切换高校选择
const toggleUniversitySelection = (id: number) => {
	const index = selectedUniversityIds.value.indexOf(id);
	if (index > -1) {
		selectedUniversityIds.value.splice(index, 1);
	} else {
		if (selectedUniversityIds.value.length < 5) {
			selectedUniversityIds.value.push(id);
		}
	}
	// 更新图表
	updateCharts();
};

// 移除高校选择
const removeUniversitySelection = (id: number) => {
	const index = selectedUniversityIds.value.indexOf(id);
	if (index > -1) {
		selectedUniversityIds.value.splice(index, 1);
	}
	// 更新图表
	updateCharts();
};

// 图表引用
const radarChart = ref<HTMLElement | null>(null);
const comparisonChart = ref<HTMLElement | null>(null);
const provinceChart = ref<HTMLElement | null>(null);
const ringChart = ref<HTMLElement | null>(null);
const histogramChart = ref<HTMLElement | null>(null);

// 图表实例
let radarChartInstance: echarts.ECharts | null = null;
let comparisonChartInstance: echarts.ECharts | null = null;
let provinceChartInstance: echarts.ECharts | null = null;
let ringChartInstance: echarts.ECharts | null = null;
let histogramChartInstance: echarts.ECharts | null = null;

// 初始化3D雷达图
const initRadarChart = () => {
	if (!radarChart.value) return;

	radarChartInstance = echarts.init(radarChart.value);

	const universitiesData = [
		{ name: "清华大学", data: [95, 92, 98, 96, 94, 93] },
		{ name: "北京大学", data: [94, 95, 96, 93, 97, 92] },
		{ name: "复旦大学", data: [90, 88, 92, 91, 89, 90] },
		{ name: "上海交通大学", data: [89, 87, 93, 92, 88, 91] },
		{ name: "浙江大学", data: [88, 86, 94, 93, 87, 92] },
		{ name: "南京大学", data: [87, 90, 91, 90, 91, 88] },
		{ name: "中国科学技术大学", data: [86, 85, 95, 94, 86, 93] },
		{ name: "哈尔滨工业大学", data: [85, 84, 92, 91, 85, 90] },
		{ name: "西安交通大学", data: [84, 83, 90, 89, 84, 88] },
		{ name: "武汉大学", data: [83, 82, 89, 88, 83, 87] }
	];

	const option: any = {
		backgroundColor: "transparent",
		title: {
			text: "综合实力雷达图",
			textStyle: {
				color: "#fff",
				fontSize: 14
			},
			left: "center"
		},
		tooltip: {
			trigger: "item"
		},
		legend: {
			data: selectedUniversityIds.value.map((id) => {
				const uni = universitiesData.find((u) => u.name === getUniversityName(id));
				return uni?.name || "";
			}),
			top: 30,
			textStyle: {
				color: "#fff"
			}
		},
		radar: {
			indicator: [
				{ name: "教学质量", max: 100 },
				{ name: "科研实力", max: 100 },
				{ name: "就业质量", max: 100 },
				{ name: "师资力量", max: 100 },
				{ name: "学科建设", max: 100 },
				{ name: "社会声誉", max: 100 }
			],
			splitArea: {
				areaStyle: {
					color: ["rgba(64, 196, 255, 0.1)", "rgba(64, 196, 255, 0.2)"]
				}
			},
			axisLine: {
				lineStyle: {
					color: "rgba(64, 196, 255, 0.5)"
				}
			},
			splitLine: {
				lineStyle: {
					color: "rgba(64, 196, 255, 0.5)"
				}
			},
			name: {
				textStyle: {
					color: "#fff"
				}
			}
		},
		series: [
			{
				name: "高校综合实力",
				type: "radar",
				data: selectedUniversityIds.value.map((id, index) => {
					const uni = universitiesData.find((u) => u.name === getUniversityName(id));
					return {
						value: uni?.data || [],
						name: uni?.name || "",
						itemStyle: {
							color: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7"][index % 5]
						},
						lineStyle: {
							color: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7"][index % 5],
							width: 3
						},
						areaStyle: {
							color: (params: any) => {
								return new echarts.graphic.RadialGradient(0.5, 0.5, 1, [
									{ offset: 0, color: params.color + "80" },
									{ offset: 1, color: params.color + "10" }
								]);
							}
						}
					};
				})
			}
		]
	};

	radarChartInstance.setOption(option);
};

// 初始化对比图表
const initComparisonChart = () => {
	if (!comparisonChart.value) return;

	comparisonChartInstance = echarts.init(comparisonChart.value);

	const universitiesData = [
		{ name: "清华大学", 录取难度: 95, 就业率: 98, 科研经费: 30, 师资力量: 96, 学科水平: 97 },
		{ name: "北京大学", 录取难度: 94, 就业率: 97, 科研经费: 28, 师资力量: 95, 学科水平: 98 },
		{ name: "复旦大学", 录取难度: 90, 就业率: 96, 科研经费: 22, 师资力量: 92, 学科水平: 93 },
		{ name: "上海交通大学", 录取难度: 89, 就业率: 97, 科研经费: 25, 师资力量: 93, 学科水平: 94 },
		{ name: "浙江大学", 录取难度: 88, 就业率: 95, 科研经费: 27, 师资力量: 91, 学科水平: 92 },
		{ name: "南京大学", 录取难度: 87, 就业率: 94, 科研经费: 20, 师资力量: 90, 学科水平: 91 },
		{ name: "中国科学技术大学", 录取难度: 86, 就业率: 95, 科研经费: 18, 师资力量: 89, 学科水平: 95 },
		{ name: "哈尔滨工业大学", 录取难度: 85, 就业率: 93, 科研经费: 21, 师资力量: 88, 学科水平: 90 },
		{ name: "西安交通大学", 录取难度: 84, 就业率: 92, 科研经费: 19, 师资力量: 87, 学科水平: 89 },
		{ name: "武汉大学", 录取难度: 83, 就业率: 91, 科研经费: 17, 师资力量: 86, 学科水平: 88 }
	];

	const indicators = ["录取难度", "就业率", "科研经费", "师资力量", "学科水平"];
	const selectedData = selectedUniversityIds.value
		.map((id) => {
			return universitiesData.find((u) => u.name === getUniversityName(id)) || null;
		})
		.filter(Boolean) as any[];

	if (chartType.value === "bar") {
		// 3D柱状图
		const option: any = {
			backgroundColor: "transparent",
			title: {
				text: "核心指标3D柱状图",
				textStyle: {
					color: "#fff",
					fontSize: 14
				},
				left: "center"
			},
			tooltip: {
				trigger: "item"
			},
			// 柱状图使用单个系列，不需要图例
			/* legend: {
				data: selectedData.map((d) => d.name),
				top: 30,
				textStyle: {
					color: "#fff"
				}
			}, */
			grid3D: {
				viewControl: {
					projection: "orthographic",
					autoRotate: true,
					autoRotateSpeed: 3
				},
				light: {
					main: {
						intensity: 1.2,
						shadow: true
					},
					ambient: {
						intensity: 0.3
					}
				}
			},
			xAxis3D: {
				type: "category",
				data: indicators,
				nameTextStyle: {
					color: "#fff"
				},
				axisLine: {
					lineStyle: {
						color: "#40C4FF"
					}
				}
			},
			yAxis3D: {
				type: "category",
				data: selectedData.map((d) => d.name),
				nameTextStyle: {
					color: "#fff"
				},
				axisLine: {
					lineStyle: {
						color: "#40C4FF"
					}
				}
			},
			zAxis3D: {
				type: "value",
				name: "数值",
				nameTextStyle: {
					color: "#fff"
				},
				axisLine: {
					lineStyle: {
						color: "#40C4FF"
					}
				}
			},
			series: [
				{
					type: "bar3D",
					data: selectedData.flatMap((university, uniIndex) => {
						return indicators.map((indicator, indIndex) => {
							return {
								value: [indIndex, uniIndex, university[indicator as keyof typeof university]],
								itemStyle: {
									color: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7"][uniIndex % 5],
									opacity: 0.8
								}
							};
						});
					}),
					emphasis: {
						itemStyle: {
							opacity: 1,
							shadowBlur: 10,
							shadowColor: "rgba(255, 255, 255, 0.5)"
						}
					},
					label: {
						show: false
					},
					shading: "lambert"
				}
			]
		};

		comparisonChartInstance.setOption(option);
	} else {
		// 曲面折线图
		const option: any = {
			backgroundColor: "transparent",
			title: {
				text: "核心指标曲面折线图",
				textStyle: {
					color: "#fff",
					fontSize: 14
				},
				left: "center"
			},
			tooltip: {
				trigger: "item"
			},
			legend: {
				data: selectedData.map((d) => d.name),
				top: 30,
				textStyle: {
					color: "#fff"
				}
			},
			grid3D: {
				viewControl: {
					projection: "orthographic",
					autoRotate: true,
					autoRotateSpeed: 3
				},
				light: {
					main: {
						intensity: 1.2,
						shadow: true
					},
					ambient: {
						intensity: 0.3
					}
				}
			},
			xAxis3D: {
				type: "category",
				data: indicators,
				nameTextStyle: {
					color: "#fff"
				},
				axisLine: {
					lineStyle: {
						color: "#40C4FF"
					}
				}
			},
			yAxis3D: {
				type: "value",
				name: "数值",
				nameTextStyle: {
					color: "#fff"
				},
				axisLine: {
					lineStyle: {
						color: "#40C4FF"
					}
				}
			},
			zAxis3D: {
				type: "category",
				data: selectedData.map((d) => d.name),
				nameTextStyle: {
					color: "#fff"
				},
				axisLine: {
					lineStyle: {
						color: "#40C4FF"
					}
				}
			},
			series: selectedData.map((university, index) => {
				return {
					name: university.name,
					type: "line3D",
					data: indicators.map((indicator, indIndex) => {
						return [indIndex, university[indicator as keyof typeof university], index];
					}),
					lineStyle: {
						color: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7"][index % 5],
						width: 4
					},
					symbol: "circle",
					symbolSize: 8,
					itemStyle: {
						color: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7"][index % 5],
						opacity: 0.9
					},
					emphasis: {
						itemStyle: {
							opacity: 1,
							shadowBlur: 10,
							shadowColor: "rgba(255, 255, 255, 0.5)"
						}
					}
				};
			})
		};

		comparisonChartInstance.setOption(option);
	}
};

// 初始化分省招生图表
const initProvinceChart = () => {
	if (!provinceChart.value) return;

	provinceChartInstance = echarts.init(provinceChart.value);

	const provinces = ["北京", "上海", "广东", "江苏", "浙江", "山东", "湖北", "四川"];
	const years = ["2022", "2023", "2024"];

	const universitiesData = [
		{
			name: "清华大学",
			data: [
				[0, 0, 300],
				[0, 1, 310],
				[0, 2, 320],
				[1, 0, 50],
				[1, 1, 55],
				[1, 2, 60],
				[2, 0, 100],
				[2, 1, 105],
				[2, 2, 110],
				[3, 0, 80],
				[3, 1, 85],
				[3, 2, 90],
				[4, 0, 90],
				[4, 1, 95],
				[4, 2, 100],
				[5, 0, 70],
				[5, 1, 75],
				[5, 2, 80],
				[6, 0, 60],
				[6, 1, 65],
				[6, 2, 70],
				[7, 0, 55],
				[7, 1, 60],
				[7, 2, 65]
			]
		},
		{
			name: "北京大学",
			data: [
				[0, 0, 290],
				[0, 1, 300],
				[0, 2, 310],
				[1, 0, 45],
				[1, 1, 50],
				[1, 2, 55],
				[2, 0, 95],
				[2, 1, 100],
				[2, 2, 105],
				[3, 0, 75],
				[3, 1, 80],
				[3, 2, 85],
				[4, 0, 85],
				[4, 1, 90],
				[4, 2, 95],
				[5, 0, 65],
				[5, 1, 70],
				[5, 2, 75],
				[6, 0, 55],
				[6, 1, 60],
				[6, 2, 65],
				[7, 0, 50],
				[7, 1, 55],
				[7, 2, 60]
			]
		},
		{
			name: "复旦大学",
			data: [
				[0, 0, 50],
				[0, 1, 52],
				[0, 2, 55],
				[1, 0, 200],
				[1, 1, 210],
				[1, 2, 220],
				[2, 0, 80],
				[2, 1, 85],
				[2, 2, 90],
				[3, 0, 120],
				[3, 1, 125],
				[3, 2, 130],
				[4, 0, 110],
				[4, 1, 115],
				[4, 2, 120],
				[5, 0, 60],
				[5, 1, 65],
				[5, 2, 70],
				[6, 0, 50],
				[6, 1, 55],
				[6, 2, 60],
				[7, 0, 45],
				[7, 1, 50],
				[7, 2, 55]
			]
		}
	];

	const selectedUniversitiesData = selectedUniversityIds.value
		.map((id) => {
			const universityName = getUniversityName(id);
			return universitiesData.find((u) => u.name === universityName) || null;
		})
		.filter(Boolean) as typeof universitiesData;

	const option: any = {
		backgroundColor: "transparent",
		title: {
			text: "分省招生与录取3D柱状图",
			textStyle: {
				color: "#fff",
				fontSize: 14
			},
			left: "center"
		},
		tooltip: {
			trigger: "item"
		},
		legend: {
			data: selectedUniversitiesData.map((d) => d.name),
			top: 30,
			textStyle: {
				color: "#fff"
			}
		},
		grid3D: {
			viewControl: {
				projection: "orthographic",
				autoRotate: true,
				autoRotateSpeed: 3
			},
			light: {
				main: {
					intensity: 1.2,
					shadow: true
				},
				ambient: {
					intensity: 0.3
				}
			}
		},
		xAxis3D: {
			type: "category",
			data: provinces,
			nameTextStyle: {
				color: "#fff"
			},
			axisLine: {
				lineStyle: {
					color: "#40C4FF"
				}
			}
		},
		yAxis3D: {
			type: "category",
			data: years,
			nameTextStyle: {
				color: "#fff"
			},
			axisLine: {
				lineStyle: {
					color: "#40C4FF"
				}
			}
		},
		zAxis3D: {
			type: "value",
			name: "招生人数",
			nameTextStyle: {
				color: "#fff"
			},
			axisLine: {
				lineStyle: {
					color: "#40C4FF"
				}
			}
		},
		series: selectedUniversitiesData.map((university, index) => {
			return {
				name: university.name,
				type: "bar3D",
				data: university.data,
				stack: "university",
				itemStyle: {
					color: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7"][index % 5] as unknown as echarts.Color,
					opacity: 0.8
				},
				emphasis: {
					itemStyle: {
						opacity: 1,
						shadowBlur: 10,
						shadowColor: "rgba(255, 255, 255, 0.5)"
					}
				},
				label: {
					show: false
				},
				shading: "lambert"
			};
		})
	};

	provinceChartInstance.setOption(option);
};

// 初始化生源结构组合图
const initCombinationChart = () => {
	if (!ringChart.value || !histogramChart.value) return;

	// 环形图
	ringChartInstance = echarts.init(ringChart.value);
	// 直方图
	histogramChartInstance = echarts.init(histogramChart.value);

	const universitiesData = [
		{
			name: "清华大学",
			ringData: [
				{ value: 45, name: "理科" },
				{ value: 30, name: "文科" },
				{ value: 20, name: "工科" },
				{ value: 5, name: "其他" }
			],
			histogramData: [650, 660, 670, 680, 690, 700]
		},
		{
			name: "北京大学",
			ringData: [
				{ value: 40, name: "理科" },
				{ value: 35, name: "文科" },
				{ value: 20, name: "工科" },
				{ value: 5, name: "其他" }
			],
			histogramData: [645, 655, 665, 675, 685, 695]
		},
		{
			name: "复旦大学",
			ringData: [
				{ value: 38, name: "理科" },
				{ value: 32, name: "文科" },
				{ value: 25, name: "工科" },
				{ value: 5, name: "其他" }
			],
			histogramData: [635, 645, 655, 665, 675, 685]
		}
	];

	// 获取第一个选中的高校数据
	const selectedUniversityId = selectedUniversityIds.value[0] || 1;
	const universityName = getUniversityName(selectedUniversityId);
	const universityData = universitiesData.find((u) => u.name === universityName) || universitiesData[0];

	// 环形图配置
	const ringOption: EChartsCoreOption = {
		backgroundColor: "transparent",
		title: {
			text: "生源类型分布",
			textStyle: {
				color: "#ccc",
				fontSize: 14
			},
			left: "center"
		},
		tooltip: {
			trigger: "item",
			color: "#ccc"
		},
		legend: {
			orient: "vertical",
			left: 10,
			bottom: 0,
			textStyle: {
				color: "#ccc"
			}
		},
		series: [
			{
				name: "生源类型",
				type: "pie",
				radius: ["40%", "70%"],
				avoidLabelOverlap: false,
				itemStyle: {
					borderRadius: 10,
					borderColor: "#0a0e17",
					borderWidth: 2,
					color: (params: any) => ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4"][params.dataIndex]
				},
				label: {
					show: false,
					position: "center",
					color: "ccc"
				},
				emphasis: {
					label: {
						show: true,
						fontSize: "20",
						fontWeight: "bold",
						color: "#ccc"
					}
				},
				labelLine: {
					show: true
				},
				data: universityData.ringData
			}
		]
	};

	// 直方图配置
	const histogramOption: EChartsCoreOption = {
		backgroundColor: "transparent",
		title: {
			text: "分数分布直方图",
			textStyle: {
				color: "#fff",
				fontSize: 14
			},
			left: "center"
		},
		tooltip: {
			trigger: "axis"
		},
		grid: {
			left: "3%",
			right: "4%",
			bottom: "3%",
			containLabel: true
		},
		xAxis: {
			type: "category",
			data: ["640以下", "640-650", "650-660", "660-670", "670-680", "680以上"],
			axisLabel: {
				color: "#ccc"
			},
			axisLine: {
				lineStyle: {
					color: "#40C4FF"
				}
			}
		},
		yAxis: {
			type: "value",
			name: "人数",
			nameTextStyle: {
				color: "#ccc"
			},
			axisLabel: {
				color: "#ccc"
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
				name: "人数",
				type: "bar",
				barWidth: "60%",
				data: universityData.histogramData,
				itemStyle: {
					color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
						{ offset: 0, color: "#40C4FF" },
						{ offset: 1, color: "#1E88E5" }
					]),
					borderRadius: [5, 5, 0, 0]
				},
				emphasis: {
					itemStyle: {
						color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
							{ offset: 0, color: "#00E5FF" },
							{ offset: 1, color: "#40C4FF" }
						])
					}
				},
				label: {
					show: true,
					position: "top",
					color: "#fff"
				}
			}
		]
	};

	ringChartInstance.setOption(ringOption);
	histogramChartInstance.setOption(histogramOption);
};

// 初始化所有图表
const initCharts = () => {
	initRadarChart();
	initComparisonChart();
	initProvinceChart();
	initCombinationChart();
};

// 更新所有图表
const updateCharts = () => {
	initRadarChart();
	initComparisonChart();
	initProvinceChart();
	initCombinationChart();
};

// 监听窗口大小变化
const handleResize = () => {
	radarChartInstance?.resize();
	comparisonChartInstance?.resize();
	provinceChartInstance?.resize();
	ringChartInstance?.resize();
	histogramChartInstance?.resize();
};

// 生命周期钩子
onMounted(() => {
	initCharts();
	window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
	window.removeEventListener("resize", handleResize);
	// 安全地销毁所有图表实例，避免因实例不存在而导致的错误
	try {
		if (radarChartInstance) {
			radarChartInstance.dispose();
			radarChartInstance = null;
		}
	} catch (e) {
		console.error("销毁radarChartInstance失败:", e);
	}
	try {
		if (comparisonChartInstance) {
			comparisonChartInstance.dispose();
			comparisonChartInstance = null;
		}
	} catch (e) {
		console.error("销毁comparisonChartInstance失败:", e);
	}
	try {
		if (provinceChartInstance) {
			provinceChartInstance.dispose();
			provinceChartInstance = null;
		}
	} catch (e) {
		console.error("销毁provinceChartInstance失败:", e);
	}
	try {
		if (ringChartInstance) {
			ringChartInstance.dispose();
			ringChartInstance = null;
		}
	} catch (e) {
		console.error("销毁ringChartInstance失败:", e);
	}
	try {
		if (histogramChartInstance) {
			histogramChartInstance.dispose();
			histogramChartInstance = null;
		}
	} catch (e) {
		console.error("销毁histogramChartInstance失败:", e);
	}
});
</script>

<style scoped>
.university-analysis-container {
	max-width: 1600px;
	margin: 0 auto;
	padding: 0 2rem;
}

/* 主内容区域 - 左右分布 */
.main-content {
	display: flex;
	gap: 2rem;
	margin-top: 2rem;
	flex-wrap: wrap;
}

/* 3D高校选择器 */
.university-selector-section {
	flex: 0 0 30%;
	min-width: 350px;
}

/* 四大联动分析模块 */
.analysis-modules-section {
	flex: 1;
	min-width: 600px;
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
	gap: 2rem;
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

/* 3D高校选择器 */
.university-selector-section {
	/* 已合并到上面的样式中 */
}

.selector-card {
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

.selector-content {
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
}

.search-container {
	display: flex;
	justify-content: center;
}

.search-box {
	display: flex;
	align-items: center;
	background: rgba(64, 196, 255, 0.1);
	border: 1px solid rgba(64, 196, 255, 0.3);
	border-radius: 25px;
	padding: 0.5rem 1rem;
	width: 100%;
	max-width: 400px;
}

.search-icon {
	margin-right: 0.5rem;
	color: var(--primary-light);
}

.search-input {
	flex: 1;
	background: transparent;
	border: none;
	outline: none;
	color: var(--text-primary);
	font-size: 1rem;
}

.search-input::placeholder {
	color: var(--text-secondary);
}

/* 高校列表 */
.university-list-container {
	max-height: 400px;
	overflow-y: auto;
	padding-right: 0.5rem;
}

.university-list-container::-webkit-scrollbar {
	width: 8px;
}

.university-list-container::-webkit-scrollbar-track {
	background: rgba(64, 196, 255, 0.1);
	border-radius: 4px;
}

.university-list-container::-webkit-scrollbar-thumb {
	background: rgba(64, 196, 255, 0.5);
	border-radius: 4px;
}

.university-list-container::-webkit-scrollbar-thumb:hover {
	background: rgba(64, 196, 255, 0.7);
}

.university-item {
	display: flex;
	align-items: center;
	padding: 1rem;
	border-radius: 12px;
	background: rgba(64, 196, 255, 0.05);
	border: 1px solid rgba(64, 196, 255, 0.2);
	margin-bottom: 1rem;
	cursor: pointer;
	transition: all 0.3s ease;
}

.university-item:hover {
	transform: translateX(10px);
	background: rgba(64, 196, 255, 0.15);
	border-color: var(--primary-light);
	box-shadow: 0 5px 15px rgba(64, 196, 255, 0.3);
}

.university-item.selected {
	background: rgba(64, 196, 255, 0.2);
	border-color: var(--primary-light);
	box-shadow: 0 0 20px rgba(64, 196, 255, 0.5);
}

.university-logo {
	margin-right: 1rem;
}

.logo-placeholder {
	width: 50px;
	height: 50px;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	color: white;
	font-weight: bold;
	font-size: 1.2rem;
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}

.university-info {
	flex: 1;
}

.university-name {
	font-size: 1.1rem;
	font-weight: bold;
	color: var(--text-primary);
	margin-bottom: 0.25rem;
}

.university-location {
	font-size: 0.9rem;
	color: var(--text-secondary);
}

.selection-indicator {
	width: 25px;
	height: 25px;
	border-radius: 50%;
	background: rgba(64, 196, 255, 0.2);
	border: 1px solid var(--primary-light);
	display: flex;
	align-items: center;
	justify-content: center;
	color: var(--primary-light);
	font-weight: bold;
	transition: all 0.3s ease;
}

.university-item.selected .selection-indicator {
	background: var(--primary-light);
	color: var(--bg-primary);
}

/* 已选高校标签 */
.selected-universities {
	display: flex;
	flex-wrap: wrap;
	gap: 1rem;
	margin-top: 1rem;
	justify-content: center;
}

.selected-tag {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	background: rgba(64, 196, 255, 0.2);
	border: 1px solid var(--primary-light);
	border-radius: 20px;
	padding: 0.5rem 1rem;
	color: var(--text-primary);
	font-weight: 500;
	transition: all 0.3s ease;
}

.selected-tag:hover {
	background: rgba(64, 196, 255, 0.3);
	transform: translateY(-2px);
	box-shadow: 0 5px 15px rgba(64, 196, 255, 0.3);
}

.tag-remove {
	background: none;
	border: none;
	color: var(--text-primary);
	cursor: pointer;
	font-size: 1.2rem;
	line-height: 1;
	padding: 0;
	width: 20px;
	height: 20px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 50%;
	transition: all 0.3s ease;
}

.tag-remove:hover {
	background: rgba(64, 196, 255, 0.3);
	color: var(--primary-light);
}

.selection-limit {
	color: var(--warning-color);
	font-size: 0.9rem;
	display: flex;
	align-items: center;
	gap: 0.5rem;
}

/* 分析模块 */
.analysis-modules-section {
	/* 已合并到上面的样式中 */
}

.module-card {
	padding: 2rem;
	border-radius: 16px;
	transition: all 0.3s ease;
}

.module-card:hover {
	transform: translateY(-5px);
	box-shadow: 0 10px 30px rgba(64, 196, 255, 0.3);
}

.module-title {
	font-size: 1.4rem;
	margin-bottom: 1rem;
	color: var(--text-primary);
	display: flex;
	align-items: center;
	gap: 0.5rem;
}

.module-icon {
	font-size: 1.5rem;
}

.module-controls {
	display: flex;
	gap: 1rem;
	margin-bottom: 1.5rem;
	justify-content: center;
}

.control-btn {
	background: rgba(64, 196, 255, 0.1);
	border: 1px solid rgba(64, 196, 255, 0.3);
	border-radius: 20px;
	padding: 0.5rem 1.5rem;
	color: var(--text-primary);
	cursor: pointer;
	transition: all 0.3s ease;
	font-weight: 500;
}

.control-btn:hover {
	background: rgba(64, 196, 255, 0.2);
	border-color: var(--primary-light);
}

.control-btn.active {
	background: var(--primary-gradient);
	border-color: var(--primary-light);
	color: white;
	box-shadow: 0 0 15px rgba(64, 196, 255, 0.5);
}

.module-content {
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

.chart-canvas {
	width: 100%;
	height: 400px;
	border-radius: 8px;
	overflow: hidden;
}

.combination-chart {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 1rem;
}

.chart-half {
	width: 100%;
	height: 300px;
	border-radius: 8px;
	overflow: hidden;
}

/* 响应式设计 */
@media (max-width: 1200px) {
	.analysis-modules-section {
		grid-template-columns: 1fr;
	}
}

@media (max-width: 768px) {
	.university-analysis-container {
		padding: 0 1rem;
	}

	.main-title {
		font-size: 2rem;
	}

	.combination-chart {
		grid-template-columns: 1fr;
	}

	.chart-half {
		height: 250px;
	}

	.chart-canvas {
		height: 300px;
	}

	.selector-card {
		padding: 1.5rem;
	}

	.module-card {
		padding: 1.5rem;
	}
}
</style>
