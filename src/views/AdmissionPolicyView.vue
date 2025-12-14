<template>
	<div class="admission-policy-container">
		<!-- 页面标题 -->
		<section class="page-header">
			<h1 class="main-title">招生政策与专项计划</h1>
			<p class="subtitle">3D可视化展示招生政策的演变与专项计划的实施情况</p>
		</section>

		<!-- 3D政策时间轴 -->
		<section class="policy-timeline-section">
			<div class="timeline-card glass-card">
				<h2 class="section-title">3D政策时间轴</h2>
				<div class="timeline-container">
					<div ref="policyTimeline" class="timeline-canvas"></div>
				</div>
				<div class="timeline-controls">
					<button class="control-btn" @click="playTimeline">
						<span class="icon">▶️</span>
						自动播放
					</button>
					<button class="control-btn" @click="pauseTimeline">
						<span class="icon">⏸️</span>
						暂停
					</button>
					<button class="control-btn" @click="resetTimeline">
						<span class="icon">🔄</span>
						重置
					</button>
				</div>
			</div>
		</section>

		<!-- 两大联动特效模块 -->
		<section class="policy-modules-section">
			<!-- 模块1: 专项计划3D地图+增长条形图 -->
			<div class="module-card glass-card">
				<h2 class="section-title">专项计划实施情况</h2>
				<div class="module-content">
					<div class="map-section">
						<h3 class="subsection-title">专项计划覆盖地区</h3>
						<div ref="specialPlanMap" class="chart-canvas"></div>
					</div>
					<div class="bar-section">
						<h3 class="subsection-title">专项计划招生人数</h3>
						<div ref="specialPlanBar" class="chart-canvas"></div>
					</div>
				</div>
			</div>

			<!-- 模块2: 特殊招生类型对比图 -->
			<div class="module-card glass-card">
				<h2 class="section-title">特殊招生类型分析</h2>
				<div class="module-content">
					<div class="pie-section">
						<h3 class="subsection-title">特殊招生比例</h3>
						<div ref="specialAdmissionPie" class="chart-canvas"></div>
					</div>
					<div class="scatter-section">
						<h3 class="subsection-title">特殊招生录取情况</h3>
						<div ref="specialAdmissionScatter" class="chart-canvas"></div>
					</div>
				</div>
			</div>
		</section>

		<!-- 政策解读弹窗 -->
		<div v-if="showPolicyModal" class="policy-modal">
			<div class="modal-content glass-card">
				<div class="modal-header">
					<h3 class="modal-title">{{ selectedPolicy?.title }}</h3>
					<button class="close-btn" @click="closePolicyModal">
						<span>✕</span>
					</button>
				</div>
				<div class="modal-body">
					<p class="policy-date">{{ selectedPolicy?.date }}</p>
					<p class="policy-description">{{ selectedPolicy?.description }}</p>
					<div class="policy-impact">
						<h4>政策影响</h4>
						<ul>
							<li v-for="(impact, index) in selectedPolicy?.impacts" :key="index">
								{{ impact }}
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import echarts from "../utils/echarts";

// 政策数据
const policies = ref([
	{
		id: 1,
		year: 2019,
		date: "2019年3月",
		title: "强基计划启动",
		description: "教育部启动强基计划，旨在选拔培养基础学科拔尖创新人才。",
		impacts: ["新增强基计划招生渠道", "重点面向数学、物理、化学等基础学科", "强调综合素质与学科特长相结合"],
		importance: 90
	},
	{
		id: 2,
		year: 2020,
		date: "2020年4月",
		title: "强基计划全面实施",
		description: "强基计划在36所985高校全面实施，取代原有的自主招生。",
		impacts: ["自主招生正式取消", "强基计划招生规模扩大", "高考成绩占比提高至85%"],
		importance: 95
	},
	{
		id: 3,
		year: 2021,
		date: "2021年5月",
		title: "专项计划优化调整",
		description: "国家专项计划、地方专项计划和高校专项计划优化调整，扩大农村学生招生比例。",
		impacts: ["专项计划招生规模进一步扩大", "报考条件适度放宽", "录取程序简化"],
		importance: 85
	},
	{
		id: 4,
		year: 2022,
		date: "2022年6月",
		title: "强基计划完善",
		description: "强基计划新增历史、哲学、古文字学等人文社科专业。",
		impacts: ["扩大基础学科覆盖范围", "加强人文社科基础人才培养", "优化专业设置与培养方案"],
		importance: 80
	},
	{
		id: 5,
		year: 2023,
		date: "2023年3月",
		title: "招生政策综合改革",
		description: "深化高考综合改革，推进分类考试、综合评价、多元录取的招生模式。",
		impacts: ["完善综合评价招生体系", "推进大类招生与培养改革", "加强招生信息公开"],
		importance: 90
	},
	{
		id: 6,
		year: 2024,
		date: "2024年4月",
		title: "强基计划五年总结与展望",
		description: "强基计划实施五周年，总结经验并提出未来发展方向。",
		impacts: ["强基计划培养模式成熟", "基础学科拔尖人才培养成效显著", "未来将继续扩大实施范围"],
		importance: 85
	}
]);

// 专项计划数据
const specialPlanData = ref([
	{ province: "北京", count: 120, coverage: 0.9 },
	{ province: "上海", count: 95, coverage: 0.85 },
	{ province: "江苏", count: 150, coverage: 0.92 },
	{ province: "浙江", count: 130, coverage: 0.88 },
	{ province: "山东", count: 180, coverage: 0.95 },
	{ province: "广东", count: 160, coverage: 0.9 },
	{ province: "四川", count: 140, coverage: 0.87 },
	{ province: "湖北", count: 125, coverage: 0.89 },
	{ province: "湖南", count: 135, coverage: 0.91 },
	{ province: "陕西", count: 110, coverage: 0.86 }
]);

// 特殊招生类型数据
const specialAdmissionData = ref([
	{ type: "强基计划", rate: 0.15, score: 670, size: 3500 },
	{ type: "综合评价", rate: 0.12, score: 660, size: 2800 },
	{ type: "高校专项", rate: 0.08, score: 640, size: 1800 },
	{ type: "国家专项", rate: 0.1, score: 630, size: 2200 },
	{ type: "地方专项", rate: 0.07, score: 620, size: 1500 },
	{ type: "艺术类", rate: 0.05, score: 580, size: 1200 },
	{ type: "体育类", rate: 0.03, score: 550, size: 800 }
]);

// 选中的政策
const selectedPolicy = ref<any>(null);
const showPolicyModal = ref(false);

// 图表引用
const policyTimeline = ref<HTMLElement | null>(null);
const specialPlanMap = ref<HTMLElement | null>(null);
const specialPlanBar = ref<HTMLElement | null>(null);
const specialAdmissionPie = ref<HTMLElement | null>(null);
const specialAdmissionScatter = ref<HTMLElement | null>(null);

// 图表实例
let policyTimelineInstance: echarts.ECharts | null = null;
let specialPlanMapInstance: echarts.ECharts | null = null;
let specialPlanBarInstance: echarts.ECharts | null = null;
let specialAdmissionPieInstance: echarts.ECharts | null = null;
let specialAdmissionScatterInstance: echarts.ECharts | null = null;

// 时间轴动画控制
let timelineAnimation: any = null;
let currentTimelineIndex = 0;
let isTimelinePlaying = false;

// 打开政策详情弹窗
const openPolicyModal = (policy: any) => {
	selectedPolicy.value = policy;
	showPolicyModal.value = true;
	// 更新地图和图表数据
	updateSpecialPlanCharts(policy.year);
};

// 关闭政策详情弹窗
const closePolicyModal = () => {
	showPolicyModal.value = false;
	selectedPolicy.value = null;
};

// 初始化3D政策时间轴
const initPolicyTimeline = () => {
	if (!policyTimeline.value) return;

	policyTimelineInstance = echarts.init(policyTimeline.value);

	const option: any = {
		backgroundColor: "transparent",
		tooltip: {
			trigger: "item",
			formatter: "{b}<br/>{c}",
			backgroundColor: "rgba(10, 14, 23, 0.9)",
			borderColor: "#40C4FF",
			borderWidth: 1,
			textStyle: {
				color: "#fff"
			}
		},
		grid3D: {
			viewControl: {
				projection: "orthographic",
				autoRotate: true,
				autoRotateSpeed: 2
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
			data: policies.value.map((policy) => policy.year.toString()),
			name: "年份",
			nameTextStyle: {
				color: "#fff"
			},
			axisLine: {
				lineStyle: {
					color: "#40C4FF"
				}
			},
			axisLabel: {
				color: "#fff"
			}
		},
		yAxis3D: {
			type: "value",
			name: "政策重要性",
			nameTextStyle: {
				color: "#fff"
			},
			axisLine: {
				lineStyle: {
					color: "#40C4FF"
				}
			},
			axisLabel: {
				color: "#fff"
			}
		},
		zAxis3D: {
			type: "value",
			name: "政策影响范围",
			nameTextStyle: {
				color: "#fff"
			},
			axisLine: {
				lineStyle: {
					color: "#40C4FF"
				}
			},
			axisLabel: {
				color: "#fff"
			}
		},
		series: [
			{
				type: "line3D",
				data: policies.value.map((policy, index) => [index, policy.importance, Math.random() * 20 + 80]),
				lineStyle: {
					color: "#40C4FF",
					width: 3,
					opacity: 0.8
				},
				itemStyle: {
					color: "#00E5FF",
					opacity: 0.8
				},
				label: {
					show: true,
					formatter: function (params: any) {
						return policies.value[params.dataIndex].title;
					},
					color: "#fff",
					fontSize: 10
				},
				emphasis: {
					itemStyle: {
						color: "#FFD700",
						opacity: 1
					},
					label: {
						show: true,
						color: "#fff",
						fontSize: 12
					}
				},
				shading: "lambert"
			},
			{
				type: "scatter3D",
				data: policies.value.map((policy, index) => [index, policy.importance, Math.random() * 20 + 80]),
				symbolSize: function (data: any) {
					return policies.value[data[0]].importance / 10;
				},
				itemStyle: {
					color: function (params: any) {
						const colors = ["#1E88E5", "#40C4FF", "#00E5FF", "#80D8FF", "#00B8D4", "#29B6F6"];
						return colors[params.dataIndex % colors.length];
					},
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
				shading: "lambert"
			}
		]
	};

	policyTimelineInstance.setOption(option);

	// 添加点击事件
	policyTimelineInstance.on("click", (params: any) => {
		if (params.seriesType === "scatter3D") {
			openPolicyModal(policies.value[params.dataIndex]);
		}
	});
};

// 初始化专项计划3D地图
const initSpecialPlanMap = () => {
	if (!specialPlanMap.value) return;

	specialPlanMapInstance = echarts.init(specialPlanMap.value);

	// 模拟中国地图数据
	// const provinces = ["北京", "上海", "江苏", "浙江", "山东", "广东", "四川", "湖北", "湖南", "陕西"]; // 未使用
	const geoCoordMap: any = {
		北京: [116.46, 39.92],
		上海: [121.48, 31.22],
		江苏: [118.78, 32.04],
		浙江: [120.15, 30.28],
		山东: [117.0, 36.65],
		广东: [113.23, 23.16],
		四川: [104.06, 30.67],
		湖北: [114.31, 30.52],
		湖南: [112.94, 28.22],
		陕西: [108.95, 34.34]
	};

	const mapData = specialPlanData.value.map((item) => {
		return {
			name: item.province,
			value: item.count,
			coverage: item.coverage,
			geoCoord: geoCoordMap[item.province]
		};
	});

	const option: any = {
		backgroundColor: "transparent",
		tooltip: {
			trigger: "item",
			formatter: "{b}<br/>招生人数: {c}<br/>覆盖率: {d}%",
			backgroundColor: "rgba(10, 14, 23, 0.9)",
			borderColor: "#40C4FF",
			borderWidth: 1,
			textStyle: {
				color: "#fff"
			}
		},
		visualMap: {
			max: 200,
			inRange: {
				color: ["#1E88E5", "#40C4FF", "#00E5FF", "#80D8FF", "#00B8D4"]
			},
			textStyle: {
				color: "#fff"
			}
		},
		grid: {
			left: "5%",
			right: "5%",
			top: "5%",
			bottom: "5%",
			containLabel: true
		},
		xAxis: {
			type: "value",
			show: false,
			min: 70,
			max: 140
		},
		yAxis: {
			type: "value",
			show: false,
			min: 15,
			max: 50
		},
		series: [
			{
				name: "专项计划覆盖",
				type: "scatter",
				coordinateSystem: "cartesian2d", // 使用笛卡尔坐标系代替geo
				data: mapData.map((item) => [item.geoCoord[0], item.geoCoord[1], item.value, item.coverage]),
				symbolSize: function (data: any) {
					return data[2] / 10;
				},
				itemStyle: {
					color: function (params: any) {
						const colors = ["#1E88E5", "#40C4FF", "#00E5FF", "#80D8FF", "#00B8D4"];
						return colors[params.dataIndex % colors.length];
					},
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
				label: {
					show: true,
					formatter: function (params: any) {
						return mapData[params.dataIndex].name;
					},
					position: "top",
					color: "#fff",
					fontSize: 10
				}
			},
			{
				name: "覆盖范围",
				type: "effectScatter",
				coordinateSystem: "cartesian2d", // 使用笛卡尔坐标系代替geo
				data: mapData.map((item) => [item.geoCoord[0], item.geoCoord[1], item.value, item.coverage]),
				symbolSize: function (data: any) {
					return data[3] * 30;
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
		]
	};

	specialPlanMapInstance.setOption(option);
};

// 初始化专项计划条形图
const initSpecialPlanBar = () => {
	if (!specialPlanBar.value) return;

	specialPlanBarInstance = echarts.init(specialPlanBar.value);

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
		grid: {
			left: "3%",
			right: "4%",
			bottom: "3%",
			containLabel: true
		},
		xAxis: {
			type: "value",
			name: "招生人数",
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
		yAxis: {
			type: "category",
			data: specialPlanData.value.map((item) => item.province),
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
			}
		},
		series: [
			{
				name: "专项计划招生人数",
				type: "bar",
				data: specialPlanData.value.map((item) => item.count),
				itemStyle: {
					color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
						{ offset: 0, color: "#1E88E5" },
						{ offset: 1, color: "#40C4FF" }
					]),
					opacity: 0.8,
					borderWidth: 1,
					borderColor: "#fff"
				},
				emphasis: {
					itemStyle: {
						color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
							{ offset: 0, color: "#40C4FF" },
							{ offset: 1, color: "#00E5FF" }
						]),
						opacity: 1,
						borderWidth: 2
					}
				},
				animationDelay: function (idx: number) {
					return idx * 100;
				}
			}
		]
	};

	specialPlanBarInstance.setOption(option);
};

// 初始化特殊招生类型环形图
const initSpecialAdmissionPie = () => {
	if (!specialAdmissionPie.value) return;

	specialAdmissionPieInstance = echarts.init(specialAdmissionPie.value);

	const option: any = {
		backgroundColor: "transparent",
		tooltip: {
			trigger: "item",
			formatter: "{b}: {d}%",
			backgroundColor: "rgba(10, 14, 23, 0.9)",
			borderColor: "#40C4FF",
			borderWidth: 1,
			textStyle: {
				color: "#fff"
			}
		},
		legend: {
			orient: "vertical",
			left: "left",
			top: "middle",
			textStyle: {
				color: "#fff"
			}
		},
		series: [
			{
				name: "特殊招生类型",
				type: "pie",
				radius: ["40%", "70%"],
				avoidLabelOverlap: false,
				itemStyle: {
					borderRadius: 10,
					borderColor: "#0A0E17",
					borderWidth: 2,
					color: function (params: any) {
						const colors = ["#1E88E5", "#40C4FF", "#00E5FF", "#80D8FF", "#00B8D4", "#29B6F6", "#039BE5"];
						return colors[params.dataIndex % colors.length];
					}
				},
				label: {
					show: false,
					position: "center"
				},
				emphasis: {
					label: {
						show: true,
						fontSize: 20,
						fontWeight: "bold",
						color: "#fff"
					},
					itemStyle: {
						shadowBlur: 10,
						shadowOffsetX: 0,
						shadowColor: "rgba(64, 196, 255, 0.5)"
					}
				},
				labelLine: {
					show: false
				},
				data: specialAdmissionData.value.map((item) => ({
					name: item.type,
					value: item.rate * 100
				}))
			}
		]
	};

	specialAdmissionPieInstance.setOption(option);
};

// 初始化特殊招生3D散点图
const initSpecialAdmissionScatter = () => {
	if (!specialAdmissionScatter.value) return;

	specialAdmissionScatterInstance = echarts.init(specialAdmissionScatter.value);

	const option: any = {
		backgroundColor: "transparent",
		tooltip: {
			trigger: "item",
			backgroundColor: "rgba(10, 14, 23, 0.9)",
			borderColor: "#40C4FF",
			borderWidth: 1,
			textStyle: {
				color: "#fff"
			},
			formatter: function (params: any) {
				const data = specialAdmissionData.value[params.dataIndex];
				return `${data.type}<br/>录取率: ${(data.rate * 100).toFixed(1)}%<br/>平均分: ${data.score}<br/>规模: ${data.size}`;
			}
		},
		grid3D: {
			viewControl: {
				projection: "orthographic",
				autoRotate: true,
				autoRotateSpeed: 2
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
			type: "value",
			name: "录取率(%)",
			nameTextStyle: {
				color: "#fff"
			},
			axisLine: {
				lineStyle: {
					color: "#40C4FF"
				}
			},
			axisLabel: {
				color: "#fff"
			}
		},
		yAxis3D: {
			type: "value",
			name: "录取平均分",
			nameTextStyle: {
				color: "#fff"
			},
			axisLine: {
				lineStyle: {
					color: "#40C4FF"
				}
			},
			axisLabel: {
				color: "#fff"
			}
		},
		zAxis3D: {
			type: "value",
			name: "招生规模",
			nameTextStyle: {
				color: "#fff"
			},
			axisLine: {
				lineStyle: {
					color: "#40C4FF"
				}
			},
			axisLabel: {
				color: "#fff"
			}
		},
		series: [
			{
				type: "scatter3D",
				data: specialAdmissionData.value.map((item) => [item.rate * 100, item.score, item.size]),
				symbolSize: function (data: any) {
					// 使用数据中的size值(第三个元素)来计算符号大小
					return data[2] / 200;
				},
				itemStyle: {
					color: function (params: any) {
						const colors = ["#1E88E5", "#40C4FF", "#00E5FF", "#80D8FF", "#00B8D4", "#29B6F6", "#039BE5"];
						return colors[params.dataIndex % colors.length];
					},
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
				shading: "lambert",
				label: {
					show: true,
					formatter: function (params: any) {
						return specialAdmissionData.value[params.dataIndex].type;
					},
					textStyle: {
						color: "#fff",
						fontSize: 10
					}
				}
			}
		]
	};

	specialAdmissionScatterInstance.setOption(option);
};

// 更新专项计划图表数据
const updateSpecialPlanCharts = (year: number) => {
	// 模拟不同年份的数据变化
	const baseData = [...specialPlanData.value];
	const updatedData = baseData.map((item) => {
		// 根据年份生成不同的数据
		const yearFactor = (year - 2019) * 0.1;
		return {
			...item,
			count: Math.round(item.count * (1 + yearFactor * (Math.random() * 0.2 - 0.1))),
			coverage: item.coverage * (1 + yearFactor * (Math.random() * 0.1 - 0.05))
		};
	});

	// 更新地图
	if (specialPlanMapInstance) {
		specialPlanMapInstance.setOption({
			series: [
				{
					type: "scatter",
					data: updatedData.map((item) => ({
						name: item.province,
						value: item.count,
						coverage: item.coverage
					}))
				},
				{
					type: "effectScatter",
					data: updatedData.map((item) => ({
						name: item.province,
						value: item.count,
						coverage: item.coverage
					}))
				}
			]
		});
	}

	// 更新条形图
	if (specialPlanBarInstance) {
		specialPlanBarInstance.setOption({
			series: [
				{
					data: updatedData.map((item) => item.count)
				}
			]
		});
	}
};

// 播放时间轴动画
const playTimeline = () => {
	if (isTimelinePlaying) return;
	isTimelinePlaying = true;

	timelineAnimation = setInterval(() => {
		currentTimelineIndex = (currentTimelineIndex + 1) % policies.value.length;
		openPolicyModal(policies.value[currentTimelineIndex]);
	}, 3000);
};

// 暂停时间轴动画
const pauseTimeline = () => {
	if (timelineAnimation) {
		clearInterval(timelineAnimation);
		timelineAnimation = null;
		isTimelinePlaying = false;
	}
};

// 重置时间轴动画
const resetTimeline = () => {
	pauseTimeline();
	currentTimelineIndex = 0;
	if (policyTimelineInstance) {
		policyTimelineInstance.dispatchAction({
			type: "dataZoom",
			startValue: 2019,
			endValue: 2024
		});
	}
};

// 初始化所有图表
const initCharts = () => {
	initPolicyTimeline();
	initSpecialPlanMap();
	initSpecialPlanBar();
	initSpecialAdmissionPie();
	initSpecialAdmissionScatter();
};

// 监听窗口大小变化
const handleResize = () => {
	policyTimelineInstance?.resize();
	specialPlanMapInstance?.resize();
	specialPlanBarInstance?.resize();
	specialAdmissionPieInstance?.resize();
	specialAdmissionScatterInstance?.resize();
};

// 生命周期钩子
onMounted(() => {
	initCharts();
	window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
	window.removeEventListener("resize", handleResize);
	// 暂停时间轴动画
	pauseTimeline();
	// 安全地销毁所有图表实例，避免因实例不存在而导致的错误
	try {
		if (policyTimelineInstance) {
			policyTimelineInstance.dispose();
			policyTimelineInstance = null;
		}
	} catch (e) {
		console.error("销毁policyTimelineInstance失败:", e);
	}
	try {
		if (specialPlanMapInstance) {
			specialPlanMapInstance.dispose();
			specialPlanMapInstance = null;
		}
	} catch (e) {
		console.error("销毁specialPlanMapInstance失败:", e);
	}
	try {
		if (specialPlanBarInstance) {
			specialPlanBarInstance.dispose();
			specialPlanBarInstance = null;
		}
	} catch (e) {
		console.error("销毁specialPlanBarInstance失败:", e);
	}
	try {
		if (specialAdmissionPieInstance) {
			specialAdmissionPieInstance.dispose();
			specialAdmissionPieInstance = null;
		}
	} catch (e) {
		console.error("销毁specialAdmissionPieInstance失败:", e);
	}
	try {
		if (specialAdmissionScatterInstance) {
			specialAdmissionScatterInstance.dispose();
			specialAdmissionScatterInstance = null;
		}
	} catch (e) {
		console.error("销毁specialAdmissionScatterInstance失败:", e);
	}
});
</script>

<style scoped>
.admission-policy-container {
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

/* 3D政策时间轴 */
.policy-timeline-section {
	margin-bottom: 3rem;
}

.timeline-card {
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

.timeline-container {
	position: relative;
	width: 100%;
	height: 400px;
	margin-bottom: 1.5rem;
}

.timeline-canvas {
	width: 100%;
	height: 100%;
	border-radius: 8px;
	overflow: hidden;
}

.timeline-controls {
	display: flex;
	justify-content: center;
	gap: 1rem;
}

.control-btn {
	background: rgba(64, 196, 255, 0.2);
	border: 1px solid rgba(64, 196, 255, 0.4);
	border-radius: 25px;
	padding: 0.75rem 1.5rem;
	color: var(--text-primary);
	cursor: pointer;
	transition: all 0.3s ease;
	font-weight: 500;
	display: flex;
	align-items: center;
	gap: 0.5rem;
}

.control-btn:hover {
	background: rgba(64, 196, 255, 0.4);
	transform: translateY(-2px);
	box-shadow: 0 5px 15px rgba(64, 196, 255, 0.3);
}

.control-btn.active {
	background: var(--primary-gradient);
	color: white;
	border-color: var(--primary-light);
	box-shadow: 0 0 20px rgba(64, 196, 255, 0.5);
}

.icon {
	font-size: 1.2rem;
}

/* 特效模块 */
.policy-modules-section {
	display: flex;
	flex-direction: column;
	gap: 2rem;
}

.module-card {
	padding: 2rem;
	border-radius: 16px;
}

.module-content {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 2rem;
}

/* 子模块 */
.map-section,
.bar-section,
.pie-section,
.scatter-section {
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

/* 政策详情弹窗 */
.policy-modal {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.8);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 1000;
	animation: fadeIn 0.3s ease;
}

.modal-content {
	width: 80%;
	max-width: 800px;
	max-height: 80vh;
	overflow-y: auto;
	padding: 2rem;
	border-radius: 12px;
	position: relative;
	animation: slideUp 0.3s ease;
}

.modal-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 1.5rem;
	padding-bottom: 1rem;
	border-bottom: 1px solid rgba(64, 196, 255, 0.3);
}

.modal-title {
	font-size: 1.5rem;
	color: var(--text-primary);
	margin: 0;
}

.close-btn {
	background: none;
	border: none;
	color: var(--text-secondary);
	font-size: 1.5rem;
	cursor: pointer;
	padding: 0;
	width: 30px;
	height: 30px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 50%;
	transition: all 0.3s ease;
}

.close-btn:hover {
	background: rgba(255, 255, 255, 0.1);
	color: var(--text-primary);
}

.modal-body {
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

.policy-date {
	color: var(--primary-light);
	font-weight: bold;
	margin: 0;
}

.policy-description {
	color: var(--text-primary);
	line-height: 1.6;
	margin: 0;
}

.policy-impact {
	margin-top: 1rem;
}

.policy-impact h4 {
	color: var(--text-primary);
	margin-bottom: 0.5rem;
}

.policy-impact ul {
	list-style-type: none;
	padding: 0;
	margin: 0;
}

.policy-impact li {
	color: var(--text-secondary);
	margin-bottom: 0.5rem;
	padding-left: 1.5rem;
	position: relative;
}

.policy-impact li::before {
	content: "•";
	color: var(--primary-light);
	position: absolute;
	left: 0;
	font-weight: bold;
}

/* 动画效果 */
@keyframes fadeIn {
	from {
		opacity: 0;
	}
	to {
		opacity: 1;
	}
}

@keyframes slideUp {
	from {
		transform: translateY(50px);
		opacity: 0;
	}
	to {
		transform: translateY(0);
		opacity: 1;
	}
}

/* 响应式设计 */
@media (max-width: 768px) {
	.admission-policy-container {
		padding: 0 1rem;
	}

	.main-title {
		font-size: 2rem;
	}

	.timeline-card,
	.module-card {
		padding: 1.5rem;
	}

	.module-content {
		grid-template-columns: 1fr;
	}

	.timeline-container {
		height: 300px;
	}

	.chart-canvas {
		height: 250px;
	}

	.modal-content {
		width: 90%;
		padding: 1.5rem;
	}
}
</style>
