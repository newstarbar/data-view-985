<template>
	<div class="employment-further-container">
		<!-- 页面标题 -->
		<section class="page-header">
			<h1 class="main-title">就业深造质量分析</h1>
			<p class="subtitle">3D可视化展示各专业的就业分布、深造情况和薪资水平</p>
		</section>

		<!-- 3D筛选工具栏 -->
		<section class="filter-toolbar-section">
			<div class="toolbar-card glass-card">
				<h2 class="section-title">3D筛选工具栏</h2>
				<div class="toolbar-content">
					<!-- 就业质量等级筛选 -->
					<div class="filter-group">
						<h3 class="filter-title">就业质量等级</h3>
						<div class="quality-levels">
							<div
								class="quality-level"
								v-for="level in qualityLevels"
								:key="level.id"
								:class="{ active: selectedQualityLevels.includes(level.id) }"
								@click="toggleQualityLevel(level.id)"
							>
								<div class="level-icon">{{ level.icon }}</div>
								<div class="level-name">{{ level.name }}</div>
							</div>
						</div>
					</div>

					<!-- 薪资范围筛选 -->
					<div class="filter-group">
						<h3 class="filter-title">薪资范围</h3>
						<div class="slider-container">
							<div class="slider-labels">
								<span>10k</span>
								<span>20k</span>
								<span>30k</span>
							</div>
							<input type="range" v-model="salaryRange" min="10000" max="30000" step="1000" class="slider" />
							<div class="slider-value">≥ {{ (salaryRange / 1000).toFixed(0) }}k</div>
						</div>
					</div>

					<!-- 就业率筛选 -->
					<div class="filter-group">
						<h3 class="filter-title">就业率</h3>
						<div class="slider-container">
							<div class="slider-labels">
								<span>80%</span>
								<span>90%</span>
								<span>100%</span>
							</div>
							<input type="range" v-model="employmentRateRange" min="80" max="100" step="1" class="slider" />
							<div class="slider-value">≥ {{ employmentRateRange }}%</div>
						</div>
					</div>

					<!-- 深造率筛选 -->
					<div class="filter-group">
						<h3 class="filter-title">深造率</h3>
						<div class="slider-container">
							<div class="slider-labels">
								<span>40%</span>
								<span>60%</span>
								<span>80%</span>
							</div>
							<input type="range" v-model="furtherRateRange" min="40" max="80" step="5" class="slider" />
							<div class="slider-value">≥ {{ furtherRateRange }}%</div>
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

		<!-- 三大联动特效区 -->
		<section class="effect-zones-section">
			<!-- 区域1: 就业地区3D地图+行业堆叠图 -->
			<div class="zone-card glass-card">
				<h2 class="section-title">就业地区与行业分布</h2>
				<div class="zone-content">
					<div class="map-subsection">
						<h3 class="subsection-title">就业地区分布</h3>
						<div ref="employmentMap" class="chart-canvas"></div>
					</div>
					<div class="stacked-subsection">
						<h3 class="subsection-title">行业就业分布</h3>
						<div ref="industryStacked" class="chart-canvas"></div>
					</div>
				</div>
			</div>

			<!-- 区域2: 深造质量3D网络图+趋势图 -->
			<div class="zone-card glass-card">
				<h2 class="section-title">深造质量分析</h2>
				<div class="zone-content">
					<div class="network-subsection">
						<h3 class="subsection-title">深造3D网络图</h3>
						<div ref="furtherNetwork" class="chart-canvas"></div>
					</div>
					<div class="trend-subsection">
						<h3 class="subsection-title">深造率趋势图</h3>
						<div ref="furtherTrend" class="chart-canvas"></div>
					</div>
				</div>
			</div>

			<!-- 区域3: 就业质量对比图 -->
			<div class="zone-card glass-card">
				<h2 class="section-title">就业质量对比</h2>
				<div class="zone-content">
					<div class="boxplot-subsection">
						<h3 class="subsection-title">薪资分布箱线图</h3>
						<div ref="salaryBoxplot" class="chart-canvas"></div>
					</div>
					<div class="bar-subsection">
						<h3 class="subsection-title">就业质量指标</h3>
						<div ref="qualityBar" class="chart-canvas"></div>
					</div>
				</div>
			</div>
		</section>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import echarts from "../utils/echarts";
import type { EChartsCoreOption } from "../utils/echarts";
import { chinaMapData } from "../utils/chinaMapData";

// 就业质量等级
const qualityLevels = ref([
	{ id: 1, name: "A+", icon: "🏆", color: "#FFD700" },
	{ id: 2, name: "A", icon: "🥇", color: "#40C4FF" },
	{ id: 3, name: "B+", icon: "🥈", color: "#00E5FF" },
	{ id: 4, name: "B", icon: "🥉", color: "#80D8FF" }
]);

// 筛选条件
const selectedQualityLevels = ref([1, 2, 3]);
const salaryRange = ref(15000);
const employmentRateRange = ref(90);
const furtherRateRange = ref(50);

// 就业地区数据
const employmentAreaData = ref([
	{ province: "北京", count: 250, industries: { 互联网: 120, 金融: 80, 教育: 30, 其他: 20 } },
	{ province: "上海", count: 220, industries: { 互联网: 100, 金融: 90, 教育: 20, 其他: 10 } },
	{ province: "广东", count: 300, industries: { 互联网: 180, 金融: 70, 教育: 30, 其他: 20 } },
	{ province: "浙江", count: 180, industries: { 互联网: 120, 金融: 30, 教育: 20, 其他: 10 } },
	{ province: "江苏", count: 150, industries: { 互联网: 80, 金融: 40, 教育: 20, 其他: 10 } },
	{ province: "四川", count: 120, industries: { 互联网: 60, 金融: 30, 教育: 20, 其他: 10 } },
	{ province: "湖北", count: 100, industries: { 互联网: 50, 金融: 20, 教育: 20, 其他: 10 } },
	{ province: "湖南", count: 90, industries: { 互联网: 40, 金融: 20, 教育: 20, 其他: 10 } },
	{ province: "陕西", count: 80, industries: { 互联网: 30, 金融: 20, 教育: 20, 其他: 10 } },
	{ province: "山东", count: 110, industries: { 互联网: 50, 金融: 30, 教育: 20, 其他: 10 } }
]);

// 深造网络数据
const furtherNetworkData = ref({
	nodes: [
		{ id: "清华大学", value: 300, symbolSize: 30 },
		{ id: "北京大学", value: 280, symbolSize: 28 },
		{ id: "浙江大学", value: 250, symbolSize: 25 },
		{ id: "复旦大学", value: 220, symbolSize: 22 },
		{ id: "上海交通大学", value: 230, symbolSize: 23 },
		{ id: "南京大学", value: 190, symbolSize: 19 },
		{ id: "中国科学技术大学", value: 180, symbolSize: 18 },
		{ id: "武汉大学", value: 170, symbolSize: 17 },
		{ id: "华中科技大学", value: 160, symbolSize: 16 },
		{ id: "哈尔滨工业大学", value: 150, symbolSize: 15 }
	],
	links: [
		{ source: "清华大学", target: "北京大学", value: 50 },
		{ source: "清华大学", target: "浙江大学", value: 45 },
		{ source: "北京大学", target: "复旦大学", value: 40 },
		{ source: "浙江大学", target: "上海交通大学", value: 35 },
		{ source: "上海交通大学", target: "复旦大学", value: 30 },
		{ source: "南京大学", target: "中国科学技术大学", value: 25 },
		{ source: "武汉大学", target: "华中科技大学", value: 20 },
		{ source: "浙江大学", target: "南京大学", value: 25 },
		{ source: "北京大学", target: "清华大学", value: 48 },
		{ source: "哈尔滨工业大学", target: "清华大学", value: 18 }
	]
});

// 就业质量数据
const employmentQualityData = ref([
	{
		major: "计算机科学与技术",
		qualityLevel: 1,
		salaryRange: [12000, 15000, 18000, 22000, 28000],
		employmentRate: 98,
		furtherRate: 65,
		avgSalary: 18000
	},
	{
		major: "电子信息工程",
		qualityLevel: 1,
		salaryRange: [11000, 14000, 17000, 20000, 25000],
		employmentRate: 96,
		furtherRate: 60,
		avgSalary: 16500
	},
	{
		major: "机械工程",
		qualityLevel: 2,
		salaryRange: [9000, 12000, 15000, 18000, 22000],
		employmentRate: 94,
		furtherRate: 45,
		avgSalary: 14500
	},
	{
		major: "金融学",
		qualityLevel: 1,
		salaryRange: [10000, 13000, 16000, 20000, 26000],
		employmentRate: 95,
		furtherRate: 55,
		avgSalary: 17000
	},
	{
		major: "经济学",
		qualityLevel: 2,
		salaryRange: [9000, 12000, 15000, 18000, 22000],
		employmentRate: 93,
		furtherRate: 50,
		avgSalary: 15000
	},
	{
		major: "临床医学",
		qualityLevel: 3,
		salaryRange: [8000, 11000, 14000, 17000, 21000],
		employmentRate: 92,
		furtherRate: 70,
		avgSalary: 14000
	},
	{
		major: "汉语言文学",
		qualityLevel: 3,
		salaryRange: [7000, 10000, 13000, 16000, 20000],
		employmentRate: 90,
		furtherRate: 45,
		avgSalary: 13000
	},
	{
		major: "英语",
		qualityLevel: 3,
		salaryRange: [8000, 11000, 14000, 17000, 21000],
		employmentRate: 91,
		furtherRate: 40,
		avgSalary: 14000
	}
]);

// 深造率趋势数据
const furtherTrendData = ref([
	{ year: "2019", rate: 45 },
	{ year: "2020", rate: 48 },
	{ year: "2021", rate: 52 },
	{ year: "2022", rate: 55 },
	{ year: "2023", rate: 58 },
	{ year: "2024", rate: 60 }
]);

// 切换就业质量等级
const toggleQualityLevel = (levelId: number) => {
	const index = selectedQualityLevels.value.indexOf(levelId);
	if (index > -1) {
		selectedQualityLevels.value.splice(index, 1);
	} else {
		selectedQualityLevels.value.push(levelId);
	}
	// 更新图表
	updateCharts();
};

// 重置筛选条件
const resetFilters = () => {
	selectedQualityLevels.value = [1, 2, 3];
	salaryRange.value = 15000;
	employmentRateRange.value = 90;
	furtherRateRange.value = 50;
	// 更新图表
	updateCharts();
};

// 筛选后的就业质量数据
const filteredEmploymentQualityData = computed(() => {
	return employmentQualityData.value.filter((data) => {
		// 质量等级筛选
		if (!selectedQualityLevels.value.includes(data.qualityLevel)) {
			return false;
		}
		// 就业率筛选
		if (data.employmentRate < employmentRateRange.value) {
			return false;
		}
		// 深造率筛选
		if (data.furtherRate < furtherRateRange.value) {
			return false;
		}
		// 薪资筛选
		if (data.avgSalary < salaryRange.value) {
			return false;
		}
		return true;
	});
});

// 图表引用
const employmentMap = ref<HTMLElement | null>(null);
const industryStacked = ref<HTMLElement | null>(null);
const furtherNetwork = ref<HTMLElement | null>(null);
const furtherTrend = ref<HTMLElement | null>(null);
const salaryBoxplot = ref<HTMLElement | null>(null);
const qualityBar = ref<HTMLElement | null>(null);

// 图表实例
let employmentMapInstance: echarts.ECharts | null = null;
let industryStackedInstance: echarts.ECharts | null = null;
let furtherNetworkInstance: echarts.ECharts | null = null;
let furtherTrendInstance: echarts.ECharts | null = null;
let salaryBoxplotInstance: echarts.ECharts | null = null;
let qualityBarInstance: echarts.ECharts | null = null;

// 初始化就业地区3D地图
const initEmploymentMap = () => {
	if (!employmentMap.value) return;

	// 注册中国地图数据
	echarts.registerMap("china", chinaMapData);

	employmentMapInstance = echarts.init(employmentMap.value);

	const geoCoordMap: any = {
		北京: [116.46, 39.92],
		上海: [121.48, 31.22],
		广东: [113.23, 23.16],
		浙江: [120.15, 30.28],
		江苏: [118.78, 32.04],
		四川: [104.06, 30.67],
		湖北: [114.31, 30.52],
		湖南: [112.94, 28.22],
		陕西: [108.95, 34.34],
		山东: [117.0, 36.65]
	};

	const mapData = employmentAreaData.value.map((item) => {
		return {
			name: item.province,
			value: item.count,
			geoCoord: geoCoordMap[item.province]
		};
	});

	const option: any = {
		backgroundColor: "transparent",
		tooltip: {
			trigger: "item",
			formatter: "{b}: {c}人",
			backgroundColor: "rgba(10, 14, 23, 0.9)",
			borderColor: "#40C4FF",
			borderWidth: 1,
			textStyle: {
				color: "#fff"
			}
		},
		visualMap: {
			max: 300,
			inRange: {
				color: ["#1E88E5", "#40C4FF", "#00E5FF", "#80D8FF", "#00B8D4"]
			},
			textStyle: {
				color: "#fff"
			}
		},
		series: [
			{
				name: "就业人数",
				type: "scatter",
				coordinateSystem: "geo",
				data: mapData,
				symbolSize: function (data: any) {
					return data.value / 10;
				},
				itemStyle: {
					color: "#40C4FF",
					opacity: 0.8,
					borderWidth: 2,
					borderColor: "#fff"
				},
				emphasis: {
					itemStyle: {
						color: "#00E5FF",
						opacity: 1,
						borderWidth: 3,
						borderColor: "#fff"
					},
					scale: true
				},
				label: {
					show: true,
					formatter: "{b}",
					position: "top",
					color: "#fff",
					fontSize: 10
				}
			},
			{
				name: "就业热点",
				type: "effectScatter",
				coordinateSystem: "geo",
				data: mapData,
				symbolSize: function (data: any) {
					return data.value / 8;
				},
				showEffectOn: "render",
				rippleEffect: {
					brushType: "stroke"
				},
				hoverAnimation: true,
				itemStyle: {
					color: "#00E5FF",
					opacity: 0.5,
					borderWidth: 1,
					borderColor: "#fff"
				},
				zlevel: 1
			}
		],
		geo: {
			map: "china",
			roam: true,
			label: {
				show: true,
				color: "#fff",
				fontSize: 8
			},
			itemStyle: {
				areaColor: "rgba(64, 196, 255, 0.2)",
				borderColor: "rgba(64, 196, 255, 0.5)",
				borderWidth: 1
			},
			emphasis: {
				itemStyle: {
					areaColor: "rgba(64, 196, 255, 0.4)",
					borderColor: "#40C4FF",
					borderWidth: 2
				},
				label: {
					show: true,
					color: "#fff",
					fontSize: 10
				}
			}
		}
	};

	employmentMapInstance.setOption(option);

	// 添加点击事件
	employmentMapInstance.on("click", (params: any) => {
		if (params.seriesType === "scatter") {
			// 更新行业堆叠图
			updateIndustryStackedChart(params.name);
		}
	});
};

// 初始化行业堆叠图
const initIndustryStackedChart = () => {
	if (!industryStacked.value) return;

	industryStackedInstance = echarts.init(industryStacked.value);
	updateIndustryStackedChart();
};

// 更新行业堆叠图
const updateIndustryStackedChart = (selectedProvince?: string) => {
	if (!industryStackedInstance) return;

	let displayData = employmentAreaData.value;
	if (selectedProvince) {
		displayData = employmentAreaData.value.filter((item) => item.province === selectedProvince);
	}

	const industries = ["互联网", "金融", "教育", "其他"];
	const provinceNames = displayData.map((item) => item.province);

	// 准备堆叠数据
	const stackedData: any[] = [];
	industries.forEach((industry, index) => {
		stackedData.push({
			name: industry,
			type: "bar",
			stack: "total",
			data: displayData.map((item) => item.industries[industry as keyof typeof item.industries] || 0),
			itemStyle: {
				color: function () {
					const colors = ["#1E88E5", "#40C4FF", "#00E5FF", "#80D8FF"];
					return colors[index % colors.length];
				},
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
		});
	});

	const option: any = {
		backgroundColor: "transparent",
		tooltip: {
			trigger: "axis",
			axisPointer: {
				type: "shadow"
			},
			backgroundColor: "rgba(10, 14, 23, 0.9)",
			borderColor: "#40C4FF",
			borderWidth: 1,
			textStyle: {
				color: "#fff"
			}
		},
		legend: {
			data: industries,
			textStyle: {
				color: "#fff"
			},
			top: 0
		},
		grid: {
			left: "3%",
			right: "4%",
			bottom: "3%",
			top: "15%",
			containLabel: true
		},
		xAxis: {
			type: "category",
			data: provinceNames,
			axisLabel: {
				color: "#fff"
			},
			axisLine: {
				lineStyle: {
					color: "#40C4FF"
				}
			}
		},
		yAxis: {
			type: "value",
			name: "就业人数",
			nameTextStyle: {
				color: "#fff"
			},
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
		series: stackedData
	};

	industryStackedInstance.setOption(option);
};

// 初始化深造3D网络图
const initFurtherNetworkChart = () => {
	if (!furtherNetwork.value) return;

	furtherNetworkInstance = echarts.init(furtherNetwork.value);

	const option: any = {
		backgroundColor: "transparent",
		tooltip: {
			trigger: "item",
			formatter: function (params: any) {
				if (params.dataType === "edge") {
					return `${params.data.source} → ${params.data.target}: ${params.data.value}人`;
				} else {
					return `${params.data.id}: ${params.data.value}人`;
				}
			},
			backgroundColor: "rgba(10, 14, 23, 0.9)",
			borderColor: "#40C4FF",
			borderWidth: 1,
			textStyle: {
				color: "#fff"
			}
		},
		series: [
			{
				type: "graphGL",
				nodes: furtherNetworkData.value.nodes,
				edges: furtherNetworkData.value.links,
				forceAtlas2: {
					steps: 30,
					edgeWeightInfluence: 2,
					gravity: 0.2,
					scaling: 1.2
				},
				node: {
					symbolSize: function (data: any) {
						return data.symbolSize;
					},
					color: function (params: any) {
						const colors = ["#1E88E5", "#40C4FF", "#00E5FF", "#80D8FF", "#00B8D4", "#29B6F6", "#039BE5", "#1976D2", "#1565C0", "#0D47A1"];
						return colors[params.dataIndex % colors.length];
					},
					opacity: 0.8,
					borderWidth: 2,
					borderColor: "#fff"
				},
				edge: {
					color: "#40C4FF",
					lineStyle: {
						width: 2,
						opacity: 0.6,
						type: "solid"
					},
					emphasis: {
						lineStyle: {
							width: 4,
							opacity: 1,
							color: "#00E5FF"
						}
					}
				},
				label: {
					show: true,
					formatter: "{b}",
					textStyle: {
						color: "#fff",
						fontSize: 10
					}
				},
				emphasis: {
					node: {
						symbolSize: function (data: any) {
							return data.symbolSize * 1.2;
						},
						opacity: 1,
						borderWidth: 3,
						borderColor: "#fff"
					},
					edge: {
						lineStyle: {
							width: 4,
							opacity: 1,
							color: "#00E5FF"
						}
					},
					label: {
						textStyle: {
							fontSize: 12
						}
					}
				}
			}
		]
	};

	furtherNetworkInstance.setOption(option);
};

// 初始化深造率趋势图
const initFurtherTrendChart = () => {
	if (!furtherTrend.value) return;

	furtherTrendInstance = echarts.init(furtherTrend.value);

	const option: any = {
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
			data: furtherTrendData.value.map((item) => item.year),
			axisLabel: {
				color: "#fff"
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
			name: "深造率(%)",
			nameTextStyle: {
				color: "#fff"
			},
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
				name: "深造率",
				type: "line",
				data: furtherTrendData.value.map((item) => item.rate),
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
						color: "#FFD700",
						opacity: 1,
						borderWidth: 3,
						borderColor: "#fff"
					},
					scale: true
				},
				symbolSize: 8,
				symbol: "circle"
			}
		]
	};

	furtherTrendInstance.setOption(option);
};

// 初始化薪资分布3D箱线图
const initSalaryBoxplotChart = () => {
	if (!salaryBoxplot.value) return;

	salaryBoxplotInstance = echarts.init(salaryBoxplot.value);
	updateSalaryBoxplotChart();
};

// 更新薪资分布3D箱线图
const updateSalaryBoxplotChart = () => {
	if (!salaryBoxplotInstance) return;

	const option: EChartsCoreOption = {
		backgroundColor: "transparent",
		tooltip: {
			trigger: "item",
			formatter: function (params: any) {
				const data = filteredEmploymentQualityData.value[params.dataIndex];
				return `${data.major}<br/>最低工资: ${data.salaryRange[0] / 1000}k<br/>第一四分位: ${data.salaryRange[1] / 1000}k<br/>中位数: ${data.salaryRange[2] / 1000}k<br/>第三四分位: ${
					data.salaryRange[3] / 1000
				}k<br/>最高工资: ${data.salaryRange[4] / 1000}k`;
			},
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
			data: filteredEmploymentQualityData.value.map((item) => item.major),
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
			name: "薪资(元)",
			nameTextStyle: {
				color: "#fff"
			},
			axisLabel: {
				color: "#fff",
				formatter: "{value}k"
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
				name: "薪资分布",
				type: "boxplot",
				data: filteredEmploymentQualityData.value.map((item) => item.salaryRange),
				itemStyle: {
					color: "#40C4FF",
					borderColor: "#fff",
					borderWidth: 2
				},
				emphasis: {
					itemStyle: {
						color: "#00E5FF",
						borderColor: "#fff",
						borderWidth: 3
					}
				}
			}
		]
	};

	salaryBoxplotInstance.setOption(option);
};

// 初始化就业质量指标3D柱状图
const initQualityBarChart = () => {
	if (!qualityBar.value) return;

	qualityBarInstance = echarts.init(qualityBar.value);
	updateQualityBarChart();
};

// 更新就业质量指标3D柱状图
const updateQualityBarChart = () => {
	if (!qualityBarInstance) return;

	const option: EChartsCoreOption = {
		backgroundColor: "transparent",
		tooltip: {
			trigger: "axis",
			axisPointer: {
				type: "shadow"
			},
			backgroundColor: "rgba(10, 14, 23, 0.9)",
			borderColor: "#40C4FF",
			borderWidth: 1,
			textStyle: {
				color: "#fff"
			}
		},
		legend: {
			data: ["就业率(%)", "深造率(%)", "平均薪资(k)"],
			textStyle: {
				color: "#fff"
			},
			top: 0
		},
		grid: {
			left: "3%",
			right: "4%",
			bottom: "3%",
			top: "15%",
			containLabel: true
		},
		xAxis: {
			type: "category",
			data: filteredEmploymentQualityData.value.map((item) => item.major),
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
		yAxis: [
			{
				type: "value",
				name: "率值(%)",
				nameTextStyle: {
					color: "#fff"
				},
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
				},
				max: 100
			},
			{
				type: "value",
				name: "薪资(k)",
				nameTextStyle: {
					color: "#fff"
				},
				axisLabel: {
					color: "#fff"
				},
				axisLine: {
					lineStyle: {
						color: "#00E5FF"
					}
				},
				splitLine: {
					show: false
				},
				max: 30
			}
		],
		series: [
			{
				name: "就业率(%)",
				type: "bar",
				data: filteredEmploymentQualityData.value.map((item) => item.employmentRate),
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
			},
			{
				name: "深造率(%)",
				type: "bar",
				data: filteredEmploymentQualityData.value.map((item) => item.furtherRate),
				itemStyle: {
					color: "#00E5FF",
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
			},
			{
				name: "平均薪资(k)",
				type: "bar",
				yAxisIndex: 1,
				data: filteredEmploymentQualityData.value.map((item) => item.avgSalary / 1000),
				itemStyle: {
					color: "#80D8FF",
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

	qualityBarInstance.setOption(option);
};

// 初始化所有图表
const initCharts = () => {
	initEmploymentMap();
	initIndustryStackedChart();
	initFurtherNetworkChart();
	initFurtherTrendChart();
	initSalaryBoxplotChart();
	initQualityBarChart();
};

// 更新所有图表
const updateCharts = () => {
	updateIndustryStackedChart();
	updateSalaryBoxplotChart();
	updateQualityBarChart();
};

// 监听窗口大小变化
const handleResize = () => {
	employmentMapInstance?.resize();
	industryStackedInstance?.resize();
	furtherNetworkInstance?.resize();
	furtherTrendInstance?.resize();
	salaryBoxplotInstance?.resize();
	qualityBarInstance?.resize();
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
		if (employmentMapInstance) {
			employmentMapInstance.dispose();
			employmentMapInstance = null;
		}
	} catch (e) {
		console.error("销毁employmentMapInstance失败:", e);
	}
	try {
		if (industryStackedInstance) {
			industryStackedInstance.dispose();
			industryStackedInstance = null;
		}
	} catch (e) {
		console.error("销毁industryStackedInstance失败:", e);
	}
	try {
		if (furtherNetworkInstance) {
			furtherNetworkInstance.dispose();
			furtherNetworkInstance = null;
		}
	} catch (e) {
		console.error("销毁furtherNetworkInstance失败:", e);
	}
	try {
		if (furtherTrendInstance) {
			furtherTrendInstance.dispose();
			furtherTrendInstance = null;
		}
	} catch (e) {
		console.error("销毁furtherTrendInstance失败:", e);
	}
	try {
		if (salaryBoxplotInstance) {
			salaryBoxplotInstance.dispose();
			salaryBoxplotInstance = null;
		}
	} catch (e) {
		console.error("销毁salaryBoxplotInstance失败:", e);
	}
	try {
		if (qualityBarInstance) {
			qualityBarInstance.dispose();
			qualityBarInstance = null;
		}
	} catch (e) {
		console.error("销毁qualityBarInstance失败:", e);
	}
});
</script>

<style scoped>
.employment-further-container {
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

/* 3D筛选工具栏 */
.filter-toolbar-section {
	margin-bottom: 3rem;
}

.toolbar-card {
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

.toolbar-content {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
	gap: 2rem;
	align-items: center;
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

/* 就业质量等级 */
.quality-levels {
	display: flex;
	gap: 1rem;
	flex-wrap: wrap;
	justify-content: center;
}

.quality-level {
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
	min-width: 80px;
}

.quality-level:hover {
	background: rgba(64, 196, 255, 0.2);
	transform: translateY(-2px);
	box-shadow: 0 5px 15px rgba(64, 196, 255, 0.3);
}

.quality-level.active {
	background: var(--primary-gradient);
	border-color: var(--primary-light);
	box-shadow: 0 0 20px rgba(64, 196, 255, 0.5);
}

.level-icon {
	font-size: 2rem;
}

.level-name {
	font-size: 1rem;
	font-weight: bold;
	color: var(--text-primary);
}

.quality-level.active .level-name {
	color: white;
}

/* 滑块样式 */
.slider-container {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}

.slider-labels {
	display: flex;
	justify-content: space-between;
	color: var(--text-secondary);
	font-size: 0.9rem;
}

.slider {
	-webkit-appearance: none;
	width: 100%;
	height: 6px;
	border-radius: 3px;
	background: rgba(64, 196, 255, 0.3);
	outline: none;
	transition: background 0.3s ease;
}

.slider:hover {
	background: rgba(64, 196, 255, 0.5);
}

.slider::-webkit-slider-thumb {
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

.slider::-webkit-slider-thumb:hover {
	transform: scale(1.2);
	box-shadow: 0 0 15px rgba(64, 196, 255, 1);
}

.slider-value {
	font-size: 1rem;
	color: var(--primary-light);
	font-weight: bold;
	text-align: center;
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

/* 特效区 */
.effect-zones-section {
	display: flex;
	flex-direction: column;
	gap: 3rem;
}

.zone-card {
	padding: 2rem;
	border-radius: 16px;
}

.zone-content {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 2rem;
}

/* 子模块 */
.map-subsection,
.stacked-subsection,
.network-subsection,
.trend-subsection,
.boxplot-subsection,
.bar-subsection {
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

.subsection-title {
	font-size: 1.2rem;
	color: var(--text-primary);
	margin: 0;
	font-weight: bold;
	text-align: center;
}

.chart-canvas {
	width: 100%;
	height: 300px;
	border-radius: 8px;
	overflow: hidden;
}

/* 响应式设计 */
@media (max-width: 768px) {
	.employment-further-container {
		padding: 0 1rem;
	}

	.main-title {
		font-size: 2rem;
	}

	.toolbar-content {
		grid-template-columns: 1fr;
	}

	.zone-content {
		grid-template-columns: 1fr;
	}

	.quality-levels {
		justify-content: flex-start;
	}

	.chart-canvas {
		height: 250px;
	}
}
</style>
