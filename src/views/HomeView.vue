<template>
	<div class="home-container">
		<!-- 3D总览看板 -->
		<section class="overview-section">
			<div class="overview-card glass-card">
				<h2 class="section-title">3D 高校招生数据总览</h2>
				<div class="overview-content">
					<!-- 左侧矩阵微型折线图 -->
					<div class="matrix-container">
						<div ref="earthCanvas" class="matrix-canvas relative">
							<!-- 高校信息面板 -->
							<div v-if="selectedUniversity" class="absolute top-4 right-4 w-80 bg-white bg-opacity-90 rounded-lg shadow-lg p-4 border border-blue-200">
								<h3 class="text-xl font-bold text-blue-800 mb-2">{{ selectedUniversity.name }}</h3>
								<div class="text-sm text-gray-700 space-y-2">
									<p><span class="font-semibold">地区:</span> {{ selectedUniversity.area }}</p>
									<p><span class="font-semibold">类型:</span> {{ selectedUniversity.type }}</p>
									<p><span class="font-semibold">排名:</span> {{ selectedUniversity.ranking }}</p>
									<p><span class="font-semibold">性质:</span> {{ selectedUniversity.nature }}</p>
									<p><span class="font-semibold">总分:</span> {{ selectedUniversity.totalScore }}</p>
								</div>
								<button @click="selectedUniversity = null" class="mt-3 w-full bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition">关闭</button>
							</div>
						</div>
					</div>
					<!-- 右侧数据卡 -->
					<div class="data-cards-container">
						<div class="data-card glow-card" v-for="card in dataCards" :key="card.id">
							<div class="card-icon">{{ card.icon }}</div>
							<div class="card-content">
								<div class="card-title">{{ card.title }}</div>
								<div class="card-value" v-text="card.value"></div>
								<div class="card-change">{{ card.change }}</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- 核心联动矩阵 -->
		<section class="matrix-section">
			<h2 class="section-title">核心联动数据分析</h2>
			<div class="matrix-grid">
				<div class="matrix-card glass-card">
					<h3 class="card-title">高校竞争漏斗对比图</h3>
					<div class="chart-container">
						<div ref="bubbleChart" class="chart-canvas"></div>
					</div>
				</div>
				<div class="matrix-card glass-card">
					<h3 class="card-title">动态录取难度热力图</h3>
					<div class="chart-container">
						<div ref="heatmapChart" class="chart-canvas"></div>
					</div>
				</div>
				<div class="matrix-card glass-card">
					<h3 class="card-title">生源-就业桑基图</h3>
					<div class="chart-container">
						<div ref="sankeyChart" class="chart-canvas"></div>
					</div>
				</div>
				<div class="matrix-card glass-card">
					<h3 class="card-title">历年招生规模折线图</h3>
					<div class="chart-container">
						<div ref="lineChart" class="chart-canvas"></div>
					</div>
				</div>
			</div>
		</section>

		<!-- 动态数据故事线 -->
		<section class="timeline-section">
			<div class="timeline-card glass-card">
				<h2 class="section-title">政策-数据双轴时间轴</h2>
				<div class="timeline-container">
					<div class="timeline-track">
						<div class="timeline-line"></div>
						<div class="timeline-items">
							<div class="timeline-item" v-for="item in timelineItems" :key="item.id">
								<div class="timeline-dot"></div>
								<div class="timeline-content">
									<div class="timeline-year">{{ item.year }}</div>
									<div class="timeline-title">{{ item.title }}</div>
									<div class="timeline-desc">{{ item.description }}</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import echarts from "../utils/echarts";
import type { EChartsCoreOption } from "../utils/echarts";
// @ts-ignore
import universitiesData from "../data/data.json";

// 数据卡数据
const dataCards = ref([
	{ id: 1, icon: "🏫", title: "高校总数", value: "39", change: "+0 较去年", color: "#40C4FF" },
	{ id: 2, icon: "🗺️", title: "覆盖省份", value: "31", change: "全国覆盖", color: "#00E5FF" },
	{ id: 3, icon: "📅", title: "数据年份", value: "2019-2024", change: "6年跨度", color: "#80D8FF" },
	{ id: 4, icon: "📚", title: "专业数量", value: "1,200+", change: "+5% 较去年", color: "#00B8D4" }
]);

// 时间轴数据
const timelineItems = ref([
	{
		id: 1,
		year: "2019",
		title: "双一流政策实施",
		description: "开始实施双一流建设政策，重点高校招生规模扩大"
	},
	{
		id: 2,
		year: "2020",
		title: "疫情影响",
		description: "受疫情影响，招生方式发生调整，线上录取比例增加"
	},
	{
		id: 3,
		year: "2021",
		title: "新高考改革",
		description: "新高考改革全面推进，选科要求成为重要因素"
	},
	{
		id: 4,
		year: "2022",
		title: "强基计划升级",
		description: "强基计划招生规模扩大，更加注重基础学科"
	},
	{
		id: 5,
		year: "2023",
		title: "就业导向调整",
		description: "招生计划向就业前景好的专业倾斜"
	},
	{
		id: 6,
		year: "2024",
		title: "AI赋能招生",
		description: "人工智能技术在招生和专业推荐中的应用增加"
	}
]);

// 矩阵微型折线图相关
const earthCanvas = ref<HTMLElement | null>(null);
let matrixChartInstance: echarts.ECharts | null = null;

// 显示的高校信息
const selectedUniversity = ref<any>(null);

// 图表引用
const bubbleChart = ref<HTMLElement | null>(null);
const heatmapChart = ref<HTMLElement | null>(null);
const sankeyChart = ref<HTMLElement | null>(null);
const lineChart = ref<HTMLElement | null>(null);

// 图表实例
let bubbleChartInstance: echarts.ECharts | null = null;
let heatmapChartInstance: echarts.ECharts | null = null;
let sankeyChartInstance: echarts.ECharts | null = null;
let lineChartInstance: echarts.ECharts | null = null;

// 初始化矩阵微型折线图
const initEarth = () => {
	if (!earthCanvas.value) {
		console.error("Earth canvas not found");
		return;
	}

	console.log("Initializing Matrix Micro Line Chart...");

	// 初始化ECharts实例
	matrixChartInstance = echarts.init(earthCanvas.value);

	// 矩阵维度数据
	const _matrixDimensionData = {
		x: ["Mon", "Tue", "Wed", "Thu", "Fri"],
		y: [{ value: "8:00\n~\n10:00" }, { value: "10:00\n~\n12:00" }, { value: "12:00\n~\n14:00", size: 55 }, { value: "14:00\n~\n16:00" }, { value: "16:00\n~\n18:00" }, { value: "18:00\n~\n20:00" }]
	};
	const _yBreakTimeIndex = 2; // '12:00 - 14:00'
	const _seriesFakeDataLength = 365;

	// 生成ID函数
	const makeId = (xidx: number, yidx: number) => {
		return `${xidx}|${yidx}`;
	};

	// 遍历矩阵单元格函数
	const eachMatrixCell = (cb: (xval: string, yval: any, xidx: number, yidx: number) => void) => {
		_matrixDimensionData.y.forEach((yvalItem: any, yidx: number) => {
			const yval = yvalItem.value;
			if (yidx === _yBreakTimeIndex) {
				return;
			}
			_matrixDimensionData.x.forEach((xval: string, xidx: number) => {
				cb(xval, yval, xidx, yidx);
			});
		});
	};

	// 生成模拟数据函数
	const generateFakeSeriesData = (dayCount: number, xidx: number, yidx: number) => {
		const dayStart = new Date("2025-05-05T00:00:00.000Z"); // Monday
		dayStart.setDate(xidx + 5);
		const timeStart = dayStart.getTime();
		const sevenDay = 7 * 1000 * 3600 * 24;
		const cellData: any[] = [];
		let lastVal = +(Math.random() * 300).toFixed(0);
		let turnCount: number | null = null;
		let sign = -1;
		for (let idx = 0; idx < dayCount; idx++) {
			if (turnCount == null || idx >= turnCount) {
				turnCount = idx + Math.round((dayCount / 4) * ((Math.random() - 0.5) * 0.1));
				sign = -sign;
			}
			const deltaMag = 50;
			const delta = +(Math.random() * deltaMag - deltaMag / 2 + (sign * deltaMag) / 3).toFixed(0);
			const val = Math.max(0, (lastVal += delta));
			const xTime = timeStart + idx * sevenDay;
			const dataXVal = echarts.time.format(xTime, "{yyyy}-{MM}-{dd}", true);
			cellData.push([dataXVal, val]);
		}
		return cellData;
	};

	// 初始化图表配置
	const option: any = {
		// 添加图表标题和副标题
		title: {
			text: "高校数据趋势分析矩阵",
			subtext: "按星期和时间段展示数据变化趋势",
			textStyle: {
				fontSize: 20,
				color: "#fff",
				fontWeight: "bold"
			},
			subtextStyle: {
				fontSize: 14,
				color: "#aaa"
			},
			left: "center",
			top: 10
		},
		matrix: {
			x: {
				data: _matrixDimensionData.x,
				levelSize: 40,
				label: {
					fontSize: 18,
					color: "#fff",
					fontWeight: "bold"
				}
			},
			y: {
				data: _matrixDimensionData.y,
				levelSize: 75,
				label: {
					fontSize: 16,
					color: "#fff",
					fontWeight: "bold"
				}
			},
			corner: {
				data: [
					{
						coord: [-1, -1],
						value: "时间段/星期",
						label: {
							fontSize: 18,
							color: "#fff",
							fontWeight: "bold"
						}
					}
				],
				label: {
					fontSize: 18,
					color: "#fff"
				}
			},
			body: {
				data: [
					{
						coord: [null, _yBreakTimeIndex],
						coordClamp: true,
						mergeCells: true,
						value: "午休时间",
						label: {
							color: "#ffff00",
							fontSize: 18,
							fontWeight: "bold"
						}
					}
				]
			},
			top: 60,
			bottom: 100,
			width: "95%",
			left: "center"
		},
		tooltip: {
			trigger: "axis"
		},
		dataZoom: [
			{
				type: "slider",
				xAxisIndex: "all",
				left: "10%",
				right: "10%",
				bottom: 30,
				height: 30,
				throttle: 120
			},
			{
				type: "inside",
				xAxisIndex: "all",
				throttle: 120
			}
		],
		grid: [],
		xAxis: [],
		yAxis: [],
		series: []
	};

	// 为每个矩阵单元格创建微型图表
	eachMatrixCell((xval: any, yval: any, xidx: number, yidx: number) => {
		const id = makeId(xidx, yidx);
		option.grid.push({
			id: id,
			coordinateSystem: "matrix",
			coord: [xval, yval],
			top: 10,
			bottom: 10,
			left: "center",
			width: "90%",
			containLabel: true
		});
		option.xAxis.push({
			type: "category",
			id: id,
			gridId: id,
			scale: true,
			axisTick: { show: false },
			axisLabel: { show: false },
			axisLine: { show: false },
			splitLine: { show: false }
		});
		option.yAxis.push({
			id: id,
			gridId: id,
			interval: Number.MAX_SAFE_INTEGER,
			scale: true,
			axisLabel: {
				showMaxLabel: true,
				fontSize: 12,
				color: "#fff"
			},
			axisLine: { show: false },
			axisTick: { show: false }
		});
		option.series.push({
			xAxisId: id,
			yAxisId: id,
			type: "line",
			symbol: "none",
			lineStyle: {
				lineWidth: 2
			},
			data: generateFakeSeriesData(_seriesFakeDataLength, xidx, yidx)
		});
	});

	// 设置图表配置
	matrixChartInstance?.setOption(option);
	console.log("Matrix Micro Line Chart initialization completed");
};

// 控制矩阵图表旋转（保留原有按钮功能）
const rotateEarth = (direction: number) => {
	// 矩阵图表不需要旋转，保留函数以保持按钮功能
	console.log("Matrix chart rotation not implemented");
};

// 切换自动旋转（保留原有按钮功能）
const toggleAutoRotate = () => {
	// 矩阵图表不需要自动旋转，保留函数以保持按钮功能
	console.log("Auto rotation toggle not implemented for matrix chart");
};

// 停止矩阵图表动画
const stopEarthAnimation = () => {
	// 矩阵图表不需要动画，保留函数以保持一致性
	console.log("Matrix chart animation stopped");
};

// 初始化气泡图（替换为对比漏斗图）
const initBubbleChart = () => {
	if (!bubbleChart.value) return;

	bubbleChartInstance = echarts.init(bubbleChart.value);

	// 从data.json获取数据 - 使用不同指标以增加对比性
	const thuData = universitiesData.universities.find((univ) => univ.universityBaseInfo?.schoolName === "清华大学")?.enrollmentSources?.admissionChannel || [];
	const sjtuData = universitiesData.universities.find((univ) => univ.universityBaseInfo?.schoolName === "上海交通大学")?.employmentAndFurtherStudy?.furtherStudyTypes || [];

	// 预制颜色
	const COLORS = [
		{
			value: "rgba(255, 99, 132, 0.8)",
			colorStop: "rgba(255, 99, 132, 1)"
		},
		{
			value: "rgba(54, 162, 235, 0.8)",
			colorStop: "rgba(54, 162, 235, 1)"
		},
		{
			value: "rgba(255, 205, 86, 0.8)",
			colorStop: "rgba(255, 205, 86, 1)"
		},
		{
			value: "rgba(75, 192, 192, 0.8)",
			colorStop: "rgba(75, 192, 192, 1)"
		},
		{
			value: "rgba(153, 102, 255, 0.8)",
			colorStop: "rgba(153, 102, 255, 1)"
		}
	];

	// 格式化数据，按照百分比从大到小排序
	const formatData = (sourceData: any[]) => {
		return sourceData
			.sort((a, b) => (b.percentage || 0) - (a.percentage || 0))
			.map((item) => ({
				// 根据数据结构自动选择字段名
				name: item.channel || item.type,
				value: item.percentage
			}));
	};

	const option: any = {
		backgroundColor: "transparent",
		tooltip: {
			trigger: "item",
			formatter: "{a} <br/>{b} : {c}%"
		},
		legend: {
			data: ["985大学", "211大学"],
			textStyle: {
				color: "#fff"
			},
			bottom: "10%"
		},
		series: [
			{
				name: "985大学",
				type: "funnel",
				left: "10%",
				width: "30%",
				label: {
					formatter: "{b}",
					color: "#ccc"
				},
				labelLine: {
					show: false
				},
				itemStyle: {
					opacity: 0.7,
					borderColor: "transparent",
					borderWidth: 0,
					shadowBlur: 30,
					shadowColor: "rgba(0, 0, 0, 0.2)",
					shadowOffsetX: 0,
					shadowOffsetY: 10
				},
				emphasis: {
					label: {
						fontSize: 18
					},
					itemStyle: {
						opacity: 1,
						shadowBlur: 40,
						shadowColor: "rgba(0, 0, 0, 0.3)"
					}
				},
				data: formatData(thuData).map((item, index) => {
					const color = COLORS[index % COLORS.length];
					return {
						...item,
						itemStyle: {
							color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
								{ offset: 0, color: color.colorStop },
								{ offset: 1, color: color.value }
							])
						}
					};
				})
			},
			{
				name: "211大学",
				type: "funnel",
				left: "60%",
				width: "30%",
				label: {
					formatter: "{b}",
					color: "#ccc"
				},
				labelLine: {
					show: false
				},
				itemStyle: {
					opacity: 0.7,
					borderColor: "transparent",
					borderWidth: 0,
					shadowBlur: 30,
					shadowColor: "rgba(0, 0, 0, 0.2)",
					shadowOffsetX: 0,
					shadowOffsetY: 10
				},
				emphasis: {
					label: {
						fontSize: 18
					},
					itemStyle: {
						opacity: 1,
						shadowBlur: 40,
						shadowColor: "rgba(0, 0, 0, 0.3)"
					}
				},
				data: formatData(sjtuData).map((item, index) => {
					const color = COLORS[index % COLORS.length];
					return {
						...item,
						itemStyle: {
							color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
								{ offset: 0, color: color.colorStop },
								{ offset: 1, color: color.value }
							])
						}
					};
				})
			}
		]
	};

	bubbleChartInstance.setOption(option);
};

// 初始化热力图
const initHeatmapChart = () => {
	if (!heatmapChart.value) return;

	heatmapChartInstance = echarts.init(heatmapChart.value);

	const option: EChartsCoreOption = {
		backgroundColor: "transparent",
		title: {
			text: "录取难度热力图",
			textStyle: {
				color: "#fff",
				fontSize: 14
			}
		},
		tooltip: {
			position: "top",
			formatter: "{b}: {c} 分"
		},
		grid: {
			height: "60%",
			top: "15%"
		},
		xAxis: {
			type: "category",
			data: ["北京", "上海", "广东", "江苏", "浙江", "山东", "湖北", "四川", "湖南", "陕西"],
			axisLabel: {
				color: "#ccc",
				rotate: 45
			},
			axisLine: {
				lineStyle: {
					color: "#40C4FF"
				}
			}
		},
		yAxis: {
			type: "category",
			data: ["理科", "文科", "综合"],
			axisLabel: {
				color: "#ccc"
			},
			axisLine: {
				lineStyle: {
					color: "#40C4FF"
				}
			}
		},
		visualMap: {
			min: 550,
			max: 700,
			calculable: true,
			orient: "horizontal",
			left: "center",
			bottom: "10%",
			inRange: {
				color: ["#40C4FF", "#1E88E5", "#0D47A1", "#00E5FF"]
			},
			textStyle: {
				color: "#fff"
			}
		},
		series: [
			{
				name: "录取分数",
				type: "heatmap",
				data: [
					[0, 0, 680],
					[0, 1, 650],
					[0, 2, 665],
					[1, 0, 670],
					[1, 1, 640],
					[1, 2, 655],
					[2, 0, 660],
					[2, 1, 630],
					[2, 2, 645],
					[3, 0, 650],
					[3, 1, 620],
					[3, 2, 635],
					[4, 0, 655],
					[4, 1, 625],
					[4, 2, 640],
					[5, 0, 645],
					[5, 1, 615],
					[5, 2, 630],
					[6, 0, 640],
					[6, 1, 610],
					[6, 2, 625],
					[7, 0, 635],
					[7, 1, 605],
					[7, 2, 620],
					[8, 0, 630],
					[8, 1, 600],
					[8, 2, 615],
					[9, 0, 625],
					[9, 1, 595],
					[9, 2, 610]
				],
				label: {
					show: true,
					color: "#fff",
					fontSize: 12
				},
				emphasis: {
					itemStyle: {
						shadowBlur: 10,
						shadowColor: "rgba(64, 196, 255, 0.8)"
					}
				}
			}
		]
	};

	heatmapChartInstance.setOption(option);
};

// 初始化桑基图
const initSankeyChart = () => {
	if (!sankeyChart.value) return;

	sankeyChartInstance = echarts.init(sankeyChart.value);

	// 桑基图数据源
	const sourceData = [
		{ name: "北京", nameValue: 700, valueUnit: "人" },
		{ name: "上海", nameValue: 600, valueUnit: "人" },
		{ name: "广东", nameValue: 550, valueUnit: "人" },
		{ name: "江苏", nameValue: 400, valueUnit: "人" },
		{ name: "浙江", nameValue: 450, valueUnit: "人" },
		{ name: "四川", nameValue: 300, valueUnit: "人" },
		{ name: "湖北", nameValue: 250, valueUnit: "人" },
		{ name: "互联网", nameValue: 1500, valueUnit: "人" },
		{ name: "金融", nameValue: 750, valueUnit: "人" },
		{ name: "教育", nameValue: 300, valueUnit: "人" },
		{ name: "科研", nameValue: 450, valueUnit: "人" },
		{ name: "制造业", nameValue: 800, valueUnit: "人" },
		{ name: "医疗", nameValue: 250, valueUnit: "人" },
		{ name: "政府", nameValue: 200, valueUnit: "人" }
	];

	// 桑基图颜色数组
	const sangjiColor = ["#f7a365", "#44eda1", "#00ffff", "#00baff", "#f8b551", "#7ecef4", "#81c784", "#ffb74d", "#ba68c8", "#e57373", "#64b5f6", "#aed581", "#4db6ac", "#ff8a65"];

	// 为每个节点设置颜色
	const itemStyleSource = [];
	for (let d = 0; d < sourceData.length; d++) {
		// 为节点动态添加 itemStyle，避免 TypeScript 类型报错
		(sourceData[d] as any).itemStyle = {
			normal: {
				color: sangjiColor[d]
			}
		};
		itemStyleSource.push(sourceData[d]);
	}

	const option: EChartsCoreOption = {
		backgroundColor: "#013d5a",
		title: {
			text: "生源-就业桑基图",
			textStyle: {
				color: "#fff",
				fontSize: 14
			}
		},
		tooltip: {
			trigger: "item",
			triggerOn: "mousemove",
			formatter: function (o: any) {
				if (o.dataType !== "edge") {
					return o.data.name + "：" + o.data.nameValue + o.data.valueUnit;
				}
				return o.data.source + " - " + o.data.target + "：" + o.data.value + "人";
			}
		},
		series: [
			{
				type: "sankey",
				layout: "none",
				top: "12%",
				bottom: "21%",
				left: "3%",
				focusNodeAdjacency: "allEdges",
				data: itemStyleSource,
				links: [
					{ source: "北京", target: "互联网", value: 300 },
					{ source: "北京", target: "金融", value: 200 },
					{ source: "北京", target: "科研", value: 150 },
					{ source: "北京", target: "政府", value: 50 },
					{ source: "上海", target: "互联网", value: 250 },
					{ source: "上海", target: "金融", value: 250 },
					{ source: "上海", target: "教育", value: 100 },
					{ source: "广东", target: "互联网", value: 350 },
					{ source: "广东", target: "制造业", value: 150 },
					{ source: "广东", target: "金融", value: 50 },
					{ source: "江苏", target: "制造业", value: 250 },
					{ source: "江苏", target: "科研", value: 100 },
					{ source: "江苏", target: "医疗", value: 50 },
					{ source: "浙江", target: "互联网", value: 300 },
					{ source: "浙江", target: "制造业", value: 100 },
					{ source: "浙江", target: "教育", value: 50 },
					{ source: "四川", target: "互联网", value: 150 },
					{ source: "四川", target: "制造业", value: 100 },
					{ source: "四川", target: "医疗", value: 50 },
					{ source: "湖北", target: "互联网", value: 150 },
					{ source: "湖北", target: "科研", value: 50 },
					{ source: "湖北", target: "教育", value: 50 }
				],
				label: {
					color: "#fff",
					fontSize: 12,
					formatter: function (params: any) {
						return params.data.name;
					}
				},
				lineStyle: {
					color: "source",
					curveness: 0.5
				},
				itemStyle: {
					borderWidth: 1,
					borderColor: "transparent"
				}
			}
		]
	};

	sankeyChartInstance.setOption(option);
};

// 初始化折线图
const initLineChart = () => {
	if (!lineChart.value) return;

	lineChartInstance = echarts.init(lineChart.value);

	const option: EChartsCoreOption = {
		backgroundColor: "transparent",
		title: {
			text: "历年招生规模变化",
			textStyle: {
				color: "#fff",
				fontSize: 14
			}
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
			boundaryGap: false,
			data: ["2019", "2020", "2021", "2022", "2023", "2024"],
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
			name: "招生人数",
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
				name: "总招生人数",
				type: "line",
				smooth: true,
				symbol: "circle",
				symbolSize: 10,
				lineStyle: {
					color: "#40C4FF",
					width: 4,
					shadowColor: "rgba(64, 196, 255, 0.5)",
					shadowBlur: 10
				},
				areaStyle: {
					color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
						{ offset: 0, color: "rgba(64, 196, 255, 0.5)" },
						{ offset: 1, color: "rgba(64, 196, 255, 0.1)" }
					])
				},
				data: [18500, 19200, 20100, 21300, 22500, 23800],
				itemStyle: {
					color: "#00E5FF",
					borderColor: "#fff",
					borderWidth: 2
				},
				emphasis: {
					itemStyle: {
						color: "#fff",
						borderColor: "#00E5FF",
						borderWidth: 3,
						shadowBlur: 15,
						shadowColor: "rgba(0, 229, 255, 0.8)"
					}
				}
			}
		]
	};

	lineChartInstance.setOption(option);
};

// 初始化所有图表
const initCharts = () => {
	initBubbleChart();
	initHeatmapChart();
	initSankeyChart();
	initLineChart();
};

// 监听窗口大小变化
const handleResize = () => {
	// 调整矩阵图表
	matrixChartInstance?.resize();

	// 调整其他图表
	bubbleChartInstance?.resize();
	heatmapChartInstance?.resize();
	sankeyChartInstance?.resize();
	lineChartInstance?.resize();
};

// 生命周期钩子
onMounted(() => {
	// 先初始化图表，再初始化矩阵图表
	initCharts();
	// 使用setTimeout确保图表初始化完成后再初始化矩阵图表
	setTimeout(() => {
		initEarth();
	}, 100);
	window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
	window.removeEventListener("resize", handleResize);
	// 停止矩阵图表动画
	stopEarthAnimation();
	// 释放矩阵图表资源
	if (matrixChartInstance) {
		try {
			matrixChartInstance.dispose();
			matrixChartInstance = null;
		} catch (e) {
			console.error("销毁matrixChartInstance失败:", e);
		}
	}
	// 释放其他图表资源
	if (bubbleChartInstance) {
		try {
			bubbleChartInstance.dispose();
			bubbleChartInstance = null;
		} catch (e) {
			console.error("销毁bubbleChartInstance失败:", e);
		}
	}
	if (heatmapChartInstance) {
		try {
			heatmapChartInstance.dispose();
			heatmapChartInstance = null;
		} catch (e) {
			console.error("销毁heatmapChartInstance失败:", e);
		}
	}
	if (sankeyChartInstance) {
		try {
			sankeyChartInstance.dispose();
			sankeyChartInstance = null;
		} catch (e) {
			console.error("销毁sankeyChartInstance失败:", e);
		}
	}
	if (lineChartInstance) {
		try {
			lineChartInstance.dispose();
			lineChartInstance = null;
		} catch (e) {
			console.error("销毁lineChartInstance失败:", e);
		}
	}
});
</script>

<style scoped>
.home-container {
	max-width: 1400px;
	margin: 0 auto;
	padding: 0 2rem;
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

/* 3D总览看板 */
.overview-section {
	margin-bottom: 3rem;
}

.overview-card {
	padding: 2rem;
	border-radius: 16px;
}

.overview-content {
	display: flex;
	gap: 2rem;
	align-items: center;
	flex-wrap: wrap;
}

.matrix-container {
	flex: 1;
	min-width: 300px;
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.matrix-canvas {
	width: 100%;
	height: 300px;
	border-radius: 12px;
	overflow: hidden;
	position: relative;
}

.control-btn {
	background: var(--primary-gradient);
	border: none;
	border-radius: 50%;
	width: 40px;
	height: 40px;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	transition: all 0.3s ease;
	box-shadow: 0 0 10px rgba(64, 196, 255, 0.3);
}

.control-btn:hover {
	transform: scale(1.1);
	box-shadow: 0 0 15px rgba(64, 196, 255, 0.5);
}

/* 数据卡 */
.data-cards-container {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 1rem;
	flex: 1;
	min-width: 300px;
}

.data-card {
	padding: 1.5rem;
	border-radius: 12px;
	display: flex;
	align-items: center;
	gap: 1rem;
	transition: all 0.3s ease;
	position: relative;
	overflow: hidden;
}

.data-card::before {
	content: "";
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	height: 3px;
	background: var(--primary-gradient);
}

.data-card:hover {
	transform: translateY(-5px);
	box-shadow: 0 10px 20px rgba(64, 196, 255, 0.3);
}

.card-icon {
	font-size: 2rem;
	width: 50px;
	height: 50px;
	display: flex;
	align-items: center;
	justify-content: center;
	background: rgba(64, 196, 255, 0.1);
	border-radius: 12px;
	border: 1px solid rgba(64, 196, 255, 0.3);
}

.card-content {
	flex: 1;
}

.card-title {
	font-size: 0.9rem;
	color: var(--text-secondary);
	margin-bottom: 0.25rem;
}

.card-value {
	font-size: 1.8rem;
	font-weight: bold;
	color: var(--text-primary);
	margin-bottom: 0.25rem;
	text-shadow: 0 0 10px rgba(64, 196, 255, 0.5);
}

.card-change {
	font-size: 0.8rem;
	color: var(--success-color);
}

/* 核心联动矩阵 */
.matrix-section {
	margin-bottom: 3rem;
}

.matrix-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
	gap: 2rem;
}

.matrix-card {
	padding: 1.5rem;
	border-radius: 12px;
	transition: all 0.3s ease;
}

.matrix-card:hover {
	transform: translateY(-5px);
	box-shadow: 0 10px 20px rgba(64, 196, 255, 0.3);
}

.matrix-card .card-title {
	font-size: 1.2rem;
	margin-bottom: 1rem;
	color: var(--text-primary);
}

.chart-container {
	position: relative;
	width: 100%;
	height: 300px;
}

.chart-canvas {
	width: 100%;
	height: 100%;
	border-radius: 8px;
	overflow: hidden;
}

/* 时间轴 */
.timeline-section {
	margin-bottom: 3rem;
}

.timeline-card {
	padding: 2rem;
	border-radius: 16px;
}

.timeline-container {
	overflow-x: auto;
	padding: 2rem 0;
}

.timeline-track {
	position: relative;
	padding-left: 40px;
}

.timeline-line {
	position: absolute;
	left: 15px;
	top: 0;
	bottom: 0;
	width: 4px;
	background: linear-gradient(to bottom, #1e88e5, #40c4ff, #00e5ff);
	border-radius: 2px;
}

.timeline-items {
	display: flex;
	gap: 2rem;
	padding-bottom: 2rem;
	min-width: 1000px;
}

.timeline-item {
	position: relative;
	min-width: 200px;
}

.timeline-dot {
	position: absolute;
	left: -32px;
	top: 0;
	width: 16px;
	height: 16px;
	border-radius: 50%;
	background: var(--primary-light);
	border: 3px solid var(--bg-primary);
	box-shadow: 0 0 10px rgba(64, 196, 255, 0.8);
	z-index: 1;
}

.timeline-content {
	background: rgba(64, 196, 255, 0.1);
	border: 1px solid rgba(64, 196, 255, 0.3);
	border-radius: 8px;
	padding: 1rem;
	transition: all 0.3s ease;
}

.timeline-content:hover {
	background: rgba(64, 196, 255, 0.2);
	transform: translateY(-5px);
	box-shadow: 0 5px 15px rgba(64, 196, 255, 0.3);
}

.timeline-year {
	font-size: 0.9rem;
	color: var(--primary-light);
	font-weight: bold;
	margin-bottom: 0.5rem;
}

.timeline-title {
	font-size: 1rem;
	color: var(--text-primary);
	font-weight: bold;
	margin-bottom: 0.5rem;
}

.timeline-desc {
	font-size: 0.8rem;
	color: var(--text-secondary);
	line-height: 1.4;
}

/* 响应式设计 */
@media (max-width: 768px) {
	.overview-content {
		flex-direction: column;
	}

	.data-cards-container {
		grid-template-columns: 1fr;
	}

	.matrix-grid {
		grid-template-columns: 1fr;
	}

	.home-container {
		padding: 0 1rem;
	}

	.matrix-canvas {
		height: 250px;
	}
}
</style>
