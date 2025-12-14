<template>
	<div class="major-analysis-container">
		<!-- 页面标题 -->
		<section class="page-header">
			<h1 class="main-title">专业深度分析与探索</h1>
			<p class="subtitle">3D可视化展示各专业的录取情况、学科分布和就业前景</p>
		</section>

		<!-- 3D专业筛选面板 -->
		<section class="major-selector-section">
			<div class="selector-card glass-card">
				<h2 class="section-title">3D专业筛选面板</h2>
				<div class="selector-content">
					<!-- 学科门类选择 -->
					<div class="subject-category-container">
						<h3 class="category-title">学科门类</h3>
						<div class="subject-buttons">
							<button class="subject-btn" v-for="subject in subjectCategories" :key="subject.id" :class="{ active: selectedSubject === subject.id }" @click="selectSubject(subject.id)">
								{{ subject.name }}
							</button>
						</div>
					</div>

					<!-- 专业类选择 -->
					<div class="major-class-container">
						<h3 class="category-title">专业类</h3>
						<div class="major-class-grid">
							<div
								class="major-class-item"
								v-for="majorClass in filteredMajorClasses"
								:key="majorClass.id"
								:class="{ active: selectedMajorClasses.includes(majorClass.id) }"
								@click="toggleMajorClassSelection(majorClass.id)"
							>
								<div class="class-icon">{{ majorClass.icon }}</div>
								<div class="class-name">{{ majorClass.name }}</div>
								<div class="class-count">{{ majorClass.count }}个专业</div>
							</div>
						</div>
					</div>

					<!-- 筛选条件 -->
					<div class="filter-container">
						<h3 class="category-title">筛选条件</h3>

						<!-- 录取分数范围 -->
						<div class="filter-item">
							<div class="filter-label">录取分数范围</div>
							<div class="slider-container">
								<div class="slider-labels">
									<span>600</span>
									<span>650</span>
									<span>700</span>
								</div>
								<input type="range" v-model="scoreRange" min="600" max="700" step="10" class="slider" />
								<div class="slider-value">≥ {{ scoreRange }} 分</div>
							</div>
						</div>

						<!-- 就业率 -->
						<div class="filter-item">
							<div class="filter-label">就业率</div>
							<div class="slider-container">
								<div class="slider-labels">
									<span>80%</span>
									<span>90%</span>
									<span>100%</span>
								</div>
								<input type="range" v-model="employmentRate" min="80" max="100" step="5" class="slider" />
								<div class="slider-value">≥ {{ employmentRate }}%</div>
							</div>
						</div>

						<!-- 选科要求 -->
						<div class="filter-item">
							<div class="filter-label">选科要求</div>
							<div class="checkbox-group">
								<label class="checkbox-item">
									<input type="checkbox" v-model="selectedSubjects" value="物理" class="checkbox-input" />
									<span class="checkbox-label">物理</span>
								</label>
								<label class="checkbox-item">
									<input type="checkbox" v-model="selectedSubjects" value="化学" class="checkbox-input" />
									<span class="checkbox-label">化学</span>
								</label>
								<label class="checkbox-item">
									<input type="checkbox" v-model="selectedSubjects" value="生物" class="checkbox-input" />
									<span class="checkbox-label">生物</span>
								</label>
								<label class="checkbox-item">
									<input type="checkbox" v-model="selectedSubjects" value="历史" class="checkbox-input" />
									<span class="checkbox-label">历史</span>
								</label>
								<label class="checkbox-item">
									<input type="checkbox" v-model="selectedSubjects" value="地理" class="checkbox-input" />
									<span class="checkbox-label">地理</span>
								</label>
								<label class="checkbox-item">
									<input type="checkbox" v-model="selectedSubjects" value="政治" class="checkbox-input" />
									<span class="checkbox-label">政治</span>
								</label>
							</div>
						</div>

						<!-- 重置按钮 -->
						<button class="reset-btn" @click="resetFilters">
							<span class="reset-icon">🔄</span>
							重置筛选条件
						</button>
					</div>

					<!-- 筛选结果统计 -->
					<div class="filter-result">
						<div class="result-text">
							<span class="result-label">找到</span>
							<span class="result-count">{{ filteredMajors.length }}</span>
							<span class="result-label">个专业</span>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- 五大炫酷联动图表 -->
		<section class="charts-section">
			<!-- 1. 专业分布3D旭日图 -->
			<div class="chart-card glass-card">
				<h3 class="chart-title">专业分布3D旭日图</h3>
				<div class="chart-content">
					<div ref="sunburstChart" class="chart-canvas"></div>
					<button class="debug-btn" @click="initSunburstChart">手动初始化图表</button>
				</div>
			</div>

			<!-- 2. 专业录取分数曲面热力图 -->
			<div class="chart-card glass-card">
				<h3 class="chart-title">专业录取分数曲面热力图</h3>
				<div class="chart-content">
					<div ref="surfaceHeatmap" class="chart-canvas"></div>
				</div>
			</div>

			<!-- 3. 选科要求3D矩阵图 -->
			<div class="chart-card glass-card">
				<h3 class="chart-title">选科要求3D矩阵图</h3>
				<div class="chart-content">
					<div ref="subjectMatrix" class="chart-canvas"></div>
				</div>
			</div>

			<!-- 4. 就业与深造双轴3D图 -->
			<div class="chart-card glass-card">
				<h3 class="chart-title">就业与深造双轴3D图</h3>
				<div class="chart-content">
					<div ref="employmentFurther" class="chart-canvas"></div>
				</div>
			</div>

			<!-- 5. 薪资分布小提琴图 -->
			<div class="chart-card glass-card">
				<h3 class="chart-title">薪资分布小提琴图</h3>
				<div class="chart-content">
					<div ref="salaryViolin" class="chart-canvas"></div>
				</div>
			</div>
		</section>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import echarts from "../utils/echarts";

// 学科门类数据
const subjectCategories = ref([
	{ id: 1, name: "理学", icon: "🔬" },
	{ id: 2, name: "工学", icon: "⚙️" },
	{ id: 3, name: "文学", icon: "📚" },
	{ id: 4, name: "历史学", icon: "🏛️" },
	{ id: 5, name: "经济学", icon: "💰" },
	{ id: 6, name: "管理学", icon: "📊" },
	{ id: 7, name: "法学", icon: "⚖️" },
	{ id: 8, name: "医学", icon: "🩺" },
	{ id: 9, name: "教育学", icon: "🎓" },
	{ id: 10, name: "艺术学", icon: "🎨" }
]);

// 专业类数据
const majorClasses = ref([
	{ id: 1, subjectId: 1, name: "数学类", icon: "📐", count: 3 },
	{ id: 2, subjectId: 1, name: "物理学类", icon: "⚛️", count: 2 },
	{ id: 3, subjectId: 2, name: "计算机类", icon: "💻", count: 4 },
	{ id: 4, subjectId: 2, name: "电子信息类", icon: "📱", count: 5 },
	{ id: 5, subjectId: 2, name: "机械类", icon: "🔧", count: 3 },
	{ id: 6, subjectId: 3, name: "中国语言文学类", icon: "✍️", count: 2 },
	{ id: 7, subjectId: 3, name: "外国语言文学类", icon: "🌐", count: 6 },
	{ id: 8, subjectId: 5, name: "经济学类", icon: "📈", count: 3 },
	{ id: 9, subjectId: 5, name: "金融学类", icon: "🏦", count: 2 },
	{ id: 10, subjectId: 6, name: "工商管理类", icon: "💼", count: 4 },
	{ id: 11, subjectId: 8, name: "临床医学类", icon: "🩹", count: 2 },
	{ id: 12, subjectId: 8, name: "预防医学类", icon: "🦠", count: 2 }
]);

// 专业数据
const majors = ref([
	{ id: 1, classId: 1, name: "数学与应用数学", subject: "理学", majorClass: "数学类", score: 675, employmentRate: 92, furtherRate: 65, salary: 15000 },
	{ id: 2, classId: 1, name: "信息与计算科学", subject: "理学", majorClass: "数学类", score: 668, employmentRate: 94, furtherRate: 60, salary: 16000 },
	{ id: 3, classId: 2, name: "物理学", subject: "理学", majorClass: "物理学类", score: 665, employmentRate: 90, furtherRate: 70, salary: 14000 },
	{ id: 4, classId: 3, name: "计算机科学与技术", subject: "工学", majorClass: "计算机类", score: 685, employmentRate: 98, furtherRate: 55, salary: 20000 },
	{ id: 5, classId: 3, name: "软件工程", subject: "工学", majorClass: "计算机类", score: 680, employmentRate: 97, furtherRate: 50, salary: 22000 },
	{ id: 6, classId: 4, name: "电子信息工程", subject: "工学", majorClass: "电子信息类", score: 678, employmentRate: 96, furtherRate: 58, salary: 18000 },
	{ id: 7, classId: 4, name: "通信工程", subject: "工学", majorClass: "电子信息类", score: 675, employmentRate: 95, furtherRate: 60, salary: 17500 },
	{ id: 8, classId: 5, name: "机械工程", subject: "工学", majorClass: "机械类", score: 662, employmentRate: 93, furtherRate: 45, salary: 14000 },
	{ id: 9, classId: 6, name: "汉语言文学", subject: "文学", majorClass: "中国语言文学类", score: 658, employmentRate: 91, furtherRate: 52, salary: 12000 },
	{ id: 10, classId: 7, name: "英语", subject: "文学", majorClass: "外国语言文学类", score: 660, employmentRate: 92, furtherRate: 48, salary: 13000 },
	{ id: 11, classId: 7, name: "日语", subject: "文学", majorClass: "外国语言文学类", score: 655, employmentRate: 90, furtherRate: 45, salary: 12500 },
	{ id: 12, classId: 8, name: "经济学", subject: "经济学", majorClass: "经济学类", score: 670, employmentRate: 94, furtherRate: 55, salary: 16000 },
	{ id: 13, classId: 9, name: "金融学", subject: "经济学", majorClass: "金融学类", score: 675, employmentRate: 95, furtherRate: 60, salary: 18000 },
	{ id: 14, classId: 10, name: "工商管理", subject: "管理学", majorClass: "工商管理类", score: 665, employmentRate: 93, furtherRate: 50, salary: 15000 },
	{ id: 15, classId: 11, name: "临床医学", subject: "医学", majorClass: "临床医学类", score: 680, employmentRate: 96, furtherRate: 70, salary: 17000 }
]);

// 筛选条件
const selectedSubject = ref(0);
const selectedMajorClasses = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
const scoreRange = ref(600);
const employmentRate = ref(85);
const selectedSubjects = ref<string[]>([]);

// 筛选后的专业类
const filteredMajorClasses = computed(() => {
	if (selectedSubject.value === 0) {
		return majorClasses.value;
	}
	return majorClasses.value.filter((mc) => mc.subjectId === selectedSubject.value);
});

// 筛选后的专业
const filteredMajors = computed(() => {
	return majors.value.filter((major) => {
		// 专业类筛选
		if (selectedMajorClasses.value.length > 0 && !selectedMajorClasses.value.includes(major.classId)) {
			return false;
		}
		// 分数筛选
		if (major.score < scoreRange.value) {
			return false;
		}
		// 就业率筛选
		if (major.employmentRate < employmentRate.value) {
			return false;
		}
		// 选科筛选 - 这里简化处理，实际应用中需要更复杂的逻辑
		if (selectedSubjects.value.length > 0) {
			// 这里只是示例，实际应该根据专业的具体选科要求进行筛选
			return true;
		}
		return true;
	});
});

// 选择学科门类
const selectSubject = (subjectId: number) => {
	selectedSubject.value = subjectId;
	// 清空专业类选择
	selectedMajorClasses.value = [];
	// 更新图表
	updateCharts();
};

// 切换专业类选择
const toggleMajorClassSelection = (classId: number) => {
	const index = selectedMajorClasses.value.indexOf(classId);
	if (index > -1) {
		selectedMajorClasses.value.splice(index, 1);
	} else {
		selectedMajorClasses.value.push(classId);
	}
	// 更新图表
	updateCharts();
};

// 重置筛选条件
const resetFilters = () => {
	selectedSubject.value = 0;
	selectedMajorClasses.value = [];
	scoreRange.value = 600;
	employmentRate.value = 80;
	selectedSubjects.value = [];
	// 更新图表
	updateCharts();
};

// 图表引用
const sunburstChart = ref<HTMLElement | null>(null);
const surfaceHeatmap = ref<HTMLElement | null>(null);
const subjectMatrix = ref<HTMLElement | null>(null);
const employmentFurther = ref<HTMLElement | null>(null);
const salaryViolin = ref<HTMLElement | null>(null);

// 图表实例
let sunburstChartInstance: echarts.ECharts | null = null;
let surfaceHeatmapInstance: echarts.ECharts | null = null;
let subjectMatrixInstance: echarts.ECharts | null = null;
let employmentFurtherInstance: echarts.ECharts | null = null;
let salaryViolinInstance: echarts.ECharts | null = null;

// 初始化3D旭日图
const initSunburstChart = () => {
	if (!sunburstChart.value) {
		console.error("Sunburst chart container not found!");
		return;
	}

	// 确保图表容器可见
	console.log("Sunburst chart container exists:", !!sunburstChart.value);
	console.log("Container dimensions:", sunburstChart.value.clientWidth, "x", sunburstChart.value.clientHeight);

	// 设置容器尺寸（如果还没有设置的话）
	if (sunburstChart.value.clientWidth === 0 || sunburstChart.value.clientHeight === 0) {
		sunburstChart.value.style.width = "800px";
		sunburstChart.value.style.height = "500px";
		console.log("Set container dimensions:", sunburstChart.value.clientWidth, "x", sunburstChart.value.clientHeight);
	}

	// 创建ECharts实例
	if (sunburstChartInstance) {
		sunburstChartInstance.dispose();
	}
	sunburstChartInstance = echarts.init(sunburstChart.value);
	console.log("ECharts instance created:", !!sunburstChartInstance);

	// 使用filteredMajors数据构建旭日图
	const buildSunburstDataFromMajors = () => {
		// 检查filteredMajors数据
		console.log("Building sunburst data from filteredMajors:", filteredMajors.value);

		if (!filteredMajors.value || filteredMajors.value.length === 0) {
			console.log("No filtered majors data available");
			// 返回默认数据
			return [
				{
					name: "学科门类",
					children: [
						{
							name: "无数据",
							value: 1
						}
					]
				}
			];
		}

		// 按学科门类和专业类分组
		const subjectMap = new Map();

		filteredMajors.value.forEach((major) => {
			// 获取学科名称
			const subjectName = major.subject;

			// 检查学科是否已存在
			if (!subjectMap.has(subjectName)) {
				subjectMap.set(subjectName, {
					name: subjectName,
					children: []
				});
			}

			// 获取该学科下的专业类
			const subject = subjectMap.get(subjectName);
			const majorClassName = major.majorClass;

			// 查找是否已存在该专业类
			let majorClass = subject.children.find((item: any) => item.name === majorClassName);

			if (!majorClass) {
				majorClass = {
					name: majorClassName,
					children: []
				};
				subject.children.push(majorClass);
			}

			// 添加专业
			majorClass.children.push({
				name: major.name,
				value: 1 // 使用1作为基本值
			});
		});

		// 转换为数组格式
		return Array.from(subjectMap.values());
	};

	const sunburstData = buildSunburstDataFromMajors();
	console.log("Generated sunburst data:", sunburstData);

	// 图表配置
	const option = {
		backgroundColor: "#fff",
		title: {
			text: "专业分布3D旭日图",
			left: "center"
		},
		tooltip: {
			trigger: "item",
			formatter: (params: any) => {
				return `${params.data.name}<br/>数量: ${params.value}`;
			}
		},
		series: [
			{
				type: "sunburst",
				data: sunburstData,
				radius: [0, "90%"],
				center: ["50%", "50%"],
				emphasis: {
					focus: "ancestor"
				},
				label: {
					formatter: "{b}"
				}
			}
		]
	};

	// 应用配置
	sunburstChartInstance.setOption(option);

	// 监听窗口大小变化
	window.addEventListener("resize", () => {
		if (sunburstChartInstance) {
			sunburstChartInstance.resize();
		}
	});
};

// 初始化专业录取分数曲面热力图
const initSurfaceHeatmap = () => {
	if (!surfaceHeatmap.value) return;

	surfaceHeatmapInstance = echarts.init(surfaceHeatmap.value);

	const option: any = {
		backgroundColor: "transparent",
		title: {
			text: "专业录取分数分布",
			textStyle: {
				color: "#fff",
				fontSize: 14
			},
			left: "center"
		},
		tooltip: {
			trigger: "item"
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
			data: ["理学", "工学", "文学", "经济学", "管理学", "医学"],
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
			data: ["数学类", "物理学类", "计算机类", "电子信息类", "中国语言文学类", "外国语言文学类", "经济学类", "金融学类", "工商管理类", "临床医学类"],
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
			name: "录取分数",
			nameTextStyle: {
				color: "#fff"
			},
			axisLine: {
				lineStyle: {
					color: "#40C4FF"
				}
			}
		},
		visualMap: {
			max: 700,
			inRange: {
				color: ["#1E88E5", "#40C4FF", "#00E5FF", "#80D8FF", "#00B8D4"]
			},
			textStyle: {
				color: "#fff"
			}
		},
		series: [
			{
				type: "surface",
				dataShape: [6, 10], // 6个学科类别，10个专业类别
				data: filteredMajors.value.map((major) => {
					return [
						["理学", "工学", "文学", "经济学", "管理学", "医学"].indexOf(major.subject),
						["数学类", "物理学类", "计算机类", "电子信息类", "中国语言文学类", "外国语言文学类", "经济学类", "金融学类", "工商管理类", "临床医学类"].indexOf(major.majorClass),
						major.score
					];
				}),
				itemStyle: {
					opacity: 0.8,
					borderWidth: 1,
					borderColor: "#fff"
				},
				label: {
					show: false
				},
				shading: "color"
			}
		]
	};

	surfaceHeatmapInstance.setOption(option);
};

// 初始化选科要求3D矩阵图
const initSubjectMatrix = () => {
	if (!subjectMatrix.value) return;

	subjectMatrixInstance = echarts.init(subjectMatrix.value);

	const subjects = ["物理", "化学", "生物", "历史", "地理", "政治"];
	const majorCategories = ["理学", "工学", "文学", "经济学", "管理学", "医学"];

	// 模拟选科匹配度数据
	const generateMatrixData = () => {
		const data: any[] = [];
		majorCategories.forEach((category, categoryIndex) => {
			subjects.forEach((subject, subjectIndex) => {
				// 根据学科类别生成不同的匹配度
				let value = 50;
				if (category === "理学" || category === "工学") {
					if (subject === "物理" || subject === "化学") {
						value = Math.random() * 30 + 70;
					} else {
						value = Math.random() * 30 + 20;
					}
				} else if (category === "文学" || category === "经济学" || category === "管理学") {
					if (subject === "历史" || subject === "地理") {
						value = Math.random() * 30 + 60;
					} else {
						value = Math.random() * 30 + 30;
					}
				} else if (category === "医学") {
					if (subject === "生物" || subject === "化学") {
						value = Math.random() * 30 + 75;
					} else {
						value = Math.random() * 30 + 25;
					}
				}

				data.push([subjectIndex, categoryIndex, value]);
			});
		});
		return data;
	};

	const option: any = {
		backgroundColor: "transparent",
		title: {
			text: "选科要求匹配度",
			textStyle: {
				color: "#fff",
				fontSize: 14
			},
			left: "center"
		},
		tooltip: {
			trigger: "item",
			formatter: (params: any) => {
				return `${subjects[params.value[0]]} - ${majorCategories[params.value[1]]}: ${params.value[2].toFixed(0)}%`;
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
			data: subjects,
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
			data: majorCategories,
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
			name: "匹配度(%)",
			nameTextStyle: {
				color: "#fff"
			},
			axisLine: {
				lineStyle: {
					color: "#40C4FF"
				}
			},
			max: 100
		},
		visualMap: {
			max: 100,
			inRange: {
				color: ["#1E88E5", "#40C4FF", "#00E5FF", "#80D8FF", "#00B8D4"]
			},
			textStyle: {
				color: "#fff"
			}
		},
		series: [
			{
				type: "bar3D",
				data: generateMatrixData(),
				itemStyle: {
					opacity: 0.8,
					borderWidth: 1,
					borderColor: "#fff"
				},
				label: {
					show: false
				},
				shading: "lambert"
			}
		]
	};

	subjectMatrixInstance.setOption(option);
};

// 初始化就业与深造双轴3D图
const initEmploymentFurtherChart = () => {
	if (!employmentFurther.value) return;

	employmentFurtherInstance = echarts.init(employmentFurther.value);

	// 根据专业类别分组计算平均就业率和深造率
	const calculateGroupedRates = () => {
		const categoryMap: any = {};

		filteredMajors.value.forEach((major) => {
			if (!categoryMap[major.majorClass]) {
				categoryMap[major.majorClass] = {
					name: major.majorClass,
					employmentSum: 0,
					furtherSum: 0,
					count: 0
				};
			}

			categoryMap[major.majorClass].employmentSum += major.employmentRate;
			categoryMap[major.majorClass].furtherSum += major.furtherRate;
			categoryMap[major.majorClass].count += 1;
		});

		return Object.values(categoryMap).map((item: any) => ({
			name: item.name,
			employmentRate: item.employmentSum / item.count,
			furtherRate: item.furtherSum / item.count
		}));
	};

	const groupedRates = calculateGroupedRates();

	const option: any = {
		backgroundColor: "transparent",
		title: {
			text: "就业与深造情况对比",
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
			data: ["就业率", "深造率"],
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
			data: groupedRates.map((item) => item.name),
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
			name: "百分比(%)",
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
			data: ["就业率", "深造率"],
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
				name: "就业率",
				type: "bar3D",
				data: groupedRates.map((item, index) => [index, item.employmentRate, 0]),
				itemStyle: {
					color: "#40C4FF",
					opacity: 0.8,
					borderWidth: 1,
					borderColor: "#fff"
				},
				shading: "lambert"
			},
			{
				name: "深造率",
				type: "bar3D",
				data: groupedRates.map((item, index) => [index, item.furtherRate, 1]),
				itemStyle: {
					color: "#00E5FF",
					opacity: 0.8,
					borderWidth: 1,
					borderColor: "#fff"
				},
				shading: "lambert"
			}
		]
	};

	employmentFurtherInstance.setOption(option);
};

// 初始化薪资分布小提琴图
const initSalaryViolinChart = () => {
	if (!salaryViolin.value) return;

	salaryViolinInstance = echarts.init(salaryViolin.value);

	// 获取专业类别数据
	const majorClassNames = [...new Set(filteredMajors.value.map((major) => major.majorClass))];
	// 只取前15个专业类别以适应图表
	const Xdata = majorClassNames.slice(0, 15);

	// 图表标题
	const chart_title = "专业薪资分布";
	// 图表项目
	const fp_key = ["平均薪资", "最高薪资"];

	// 颜色配置
	let lineColor = "rgba(40,158,255,0.2)";
	let colors = [
		{ borderColor: "rgba(2,201,254,1)", start: "rgba(2,201,254,0.8)", end: "rgba(17,107,243,0.3)" },
		{ borderColor: "rgba(0,222,255,1)", start: "rgba(205,178,73,0.3)", end: "rgba(252,205,20,0.8)" }
	];

	// 生成模拟的月度薪资数据
	const generateMonthlyData = () => {
		const data: any = {};
		for (let month = 0; month < 6; month++) {
			data[month] = [];
			// 平均薪资数据
			data[month][0] = Xdata.map((majorClass) => {
				const major = filteredMajors.value.find((m) => m.majorClass === majorClass);
				if (!major) return 0;
				// 在平均薪资基础上添加一些随机波动
				const variation = (Math.random() - 0.5) * 5000;
				return Math.round(major.salary + variation);
			});
			// 最高薪资数据
			data[month][1] = Xdata.map((majorClass) => {
				const major = filteredMajors.value.find((m) => m.majorClass === majorClass);
				if (!major) return 0;
				// 最高薪资比平均薪资高20%-50%
				const premium = 1.2 + Math.random() * 0.3;
				return Math.round(major.salary * premium);
			});
		}
		return data;
	};

	// 图表项目数据
	const LF_val = generateMonthlyData();
	const TS_val = generateMonthlyData();

	// 时间线数据
	const timeLineData = [1, 2, 3, 4, 5, 6];

	// 构建option配置
	const option: any = {
		baseOption: {
			timeline: {
				show: true,
				axisType: "category",
				tooltip: {
					show: true,
					formatter: function (params: any) {
						return params.name + "月份薪资统计";
					}
				},
				autoPlay: true,
				currentIndex: 0,
				playInterval: 3000,
				left: "3%",
				right: "3%",
				bottom: "0%",
				width: "94%",
				label: {
					normal: {
						show: true,
						interval: "auto",
						formatter: "{value}月",
						textStyle: {
							color: "#fff"
						}
					},
					emphasis: {
						textStyle: {
							color: "#fff"
						}
					}
				},
				symbolSize: 10,
				lineStyle: {
					color: "#fff"
				},
				checkpointStyle: {
					borderColor: "#fff",
					borderWidth: 2
				},
				controlStyle: {
					showNextBtn: true,
					showPrevBtn: true,
					normal: {
						color: "#319af3",
						borderColor: "#319af3"
					},
					emphasis: {
						color: "#fff",
						borderColor: "#fff"
					}
				},
				data: []
			},
			title: {
				text: chart_title,
				textStyle: {
					color: "#fff",
					fontSize: 16
				}
			},
			legend: {
				data: fp_key,
				top: "0%",
				right: "5%",
				itemWidth: 12,
				itemHeight: 5,
				icon: "horizontal",
				textStyle: {
					color: "#fff",
					fontSize: 14
				}
			},
			tooltip: {
				show: true,
				trigger: "axis",
				axisPointer: {
					type: "shadow"
				}
			},
			grid: [
				{ show: false, left: "5%", top: "10%", bottom: "8%", containLabel: true, width: "40%" },
				{ show: false, left: "50%", top: "15%", bottom: "7%", width: "0%" },
				{ show: false, left: "55%", top: "10%", bottom: "8%", containLabel: true, width: "40%" },
				{ gridindex: 3, show: false }
			],
			xAxis: [
				{
					type: "value",
					triggerEvent: true,
					inverse: true,
					axisLine: {
						show: false
					},
					axisTick: {
						show: false
					},
					position: "top",
					axisLabel: {
						show: true,
						textStyle: {
							color: "#fff",
							fontSize: 12
						}
					},
					splitLine: {
						show: true,
						lineStyle: {
							color: lineColor
						}
					}
				},
				{ gridIndex: 1, show: false },
				{
					gridIndex: 2,
					type: "value",
					axisLine: {
						show: false
					},
					axisTick: {
						show: false
					},
					position: "top",
					axisLabel: {
						show: true,
						textStyle: {
							color: "#fff",
							fontSize: 12
						}
					},
					splitLine: {
						show: true,
						lineStyle: {
							color: lineColor
						}
					}
				},
				{ gridIndex: 3, type: "value", show: false }
			],
			yAxis: [
				{
					type: "category",
					inverse: true,
					position: "right",
					axisLine: { show: false },
					axisTick: { show: false },
					axisLabel: {
						show: false,
						margin: 8,
						textStyle: {
							color: "#fff",
							fontSize: 12
						}
					},
					data: Xdata
				},
				{
					gridIndex: 1,
					type: "category",
					inverse: true,
					position: "left",
					axisLine: { show: false },
					axisTick: { show: false },
					axisLabel: {
						show: true,
						textStyle: {
							color: "#9D9EA0",
							fontSize: 12
						}
					},
					data: Xdata.map(function (value) {
						return {
							value: value,
							textStyle: {
								align: "center"
							}
						};
					})
				},
				{
					gridIndex: 2,
					type: "category",
					inverse: true,
					position: "left",
					axisLine: { show: false },
					axisTick: { show: false },
					axisLabel: {
						show: false,
						textStyle: {
							color: "#9D9EA0",
							fontSize: 12
						}
					},
					data: Xdata
				},
				{
					gridIndex: 3,
					type: "category",
					inverse: true,
					position: "left",
					axisLine: { show: false },
					axisTick: { show: false },
					axisLabel: {
						show: false,
						textStyle: {
							color: "#9D9EA0",
							fontSize: 12
						}
					},
					data: Xdata
				}
			],
			series: []
		},
		options: []
	};

	// 填充时间线数据
	for (var i = 0; i < timeLineData.length; i++) {
		option.baseOption.timeline.data.push(timeLineData[i]);
		option.options.push({
			series: [
				{
					name: fp_key[0],
					type: "bar",
					stack: "one",
					realtimeSort: false,
					barGap: 12,
					barWidth: 12,
					label: {
						normal: {
							show: true,
							position: "inside",
							textStyle: {
								color: "#fff",
								fontSize: 11
							}
						},
						emphasis: {
							show: true,
							position: "inside",
							offset: [0, 0],
							textStyle: {
								color: "#fff",
								fontSize: 12
							}
						}
					},
					itemStyle: {
						normal: {
							color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
								{ offset: 0, color: colors[0].start },
								{ offset: 1, color: colors[0].end }
							])
						}
					},
					data: LF_val[i] ? LF_val[i][0] : []
				},
				{
					name: fp_key[1],
					stack: "right",
					type: "bar",
					realtimeSort: true,
					barGap: 12,
					barWidth: 12,
					xAxisIndex: 2,
					yAxisIndex: 2,
					label: {
						normal: {
							show: true,
							position: "inside",
							textStyle: {
								color: "#fff",
								fontSize: 12
							}
						},
						emphasis: {
							show: true,
							position: "inside",
							offset: [0, 0],
							textStyle: {
								color: "#fff",
								fontSize: 12
							}
						}
					},
					itemStyle: {
						normal: {
							color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
								{ offset: 0, color: colors[1].start },
								{ offset: 1, color: colors[1].end }
							])
						}
					},
					data: TS_val[i] ? TS_val[i][1] : []
				}
			]
		});
	}

	salaryViolinInstance.setOption(option);
};

// 初始化所有图表
const initCharts = () => {
	initSunburstChart();
	initSurfaceHeatmap();
	initSubjectMatrix();
	initEmploymentFurtherChart();
	initSalaryViolinChart();
};

// 更新所有图表
const updateCharts = () => {
	initSunburstChart();
	initSurfaceHeatmap();
	initSubjectMatrix();
	initEmploymentFurtherChart();
	initSalaryViolinChart();
};

// 监听窗口大小变化
const handleResize = () => {
	sunburstChartInstance?.resize();
	surfaceHeatmapInstance?.resize();
	subjectMatrixInstance?.resize();
	employmentFurtherInstance?.resize();
	salaryViolinInstance?.resize();
};

// 生命周期钩子
onMounted(() => {
	// 确保DOM加载完成后初始化图表
	console.log("Component mounted, initializing charts...");
	initCharts();
	window.addEventListener("resize", handleResize);

	// 添加1秒延迟后再次初始化，确保所有依赖都已加载
	setTimeout(() => {
		console.log("Re-initializing charts after 1 second...");
		initCharts();
	}, 1000);
});

onUnmounted(() => {
	window.removeEventListener("resize", handleResize);
	// 安全地销毁所有图表实例，避免因实例不存在而导致的错误
	try {
		if (sunburstChartInstance) {
			sunburstChartInstance.dispose();
			sunburstChartInstance = null;
		}
	} catch (e) {
		console.error("销毁sunburstChartInstance失败:", e);
	}
	try {
		if (surfaceHeatmapInstance) {
			surfaceHeatmapInstance.dispose();
			surfaceHeatmapInstance = null;
		}
	} catch (e) {
		console.error("销毁surfaceHeatmapInstance失败:", e);
	}
	try {
		if (subjectMatrixInstance) {
			subjectMatrixInstance.dispose();
			subjectMatrixInstance = null;
		}
	} catch (e) {
		console.error("销毁subjectMatrixInstance失败:", e);
	}
	try {
		if (employmentFurtherInstance) {
			employmentFurtherInstance.dispose();
			employmentFurtherInstance = null;
		}
	} catch (e) {
		console.error("销毁employmentFurtherInstance失败:", e);
	}
	try {
		if (salaryViolinInstance) {
			salaryViolinInstance.dispose();
			salaryViolinInstance = null;
		}
	} catch (e) {
		console.error("销毁salaryViolinInstance失败:", e);
	}
});
</script>

<style scoped>
.major-analysis-container {
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

/* 3D专业筛选面板 */
.major-selector-section {
	margin-bottom: 3rem;
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
	gap: 2rem;
}

/* 学科门类选择 */
.subject-category-container {
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

.category-title {
	font-size: 1.2rem;
	color: var(--text-primary);
	margin: 0;
	font-weight: bold;
}

.subject-buttons {
	display: flex;
	flex-wrap: wrap;
	gap: 1rem;
	justify-content: center;
}

.subject-btn {
	background: rgba(64, 196, 255, 0.1);
	border: 1px solid rgba(64, 196, 255, 0.3);
	border-radius: 25px;
	padding: 0.75rem 1.5rem;
	color: var(--text-primary);
	cursor: pointer;
	transition: all 0.3s ease;
	font-weight: 500;
	position: relative;
	overflow: hidden;
}

.subject-btn:hover {
	background: rgba(64, 196, 255, 0.2);
	transform: translateY(-2px);
	box-shadow: 0 5px 15px rgba(64, 196, 255, 0.3);
}

.subject-btn.active {
	background: var(--primary-gradient);
	color: white;
	border-color: var(--primary-light);
	box-shadow: 0 0 20px rgba(64, 196, 255, 0.5);
}

/* 专业类选择 */
.major-class-container {
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

.major-class-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
	gap: 1rem;
}

.major-class-item {
	background: rgba(64, 196, 255, 0.1);
	border: 1px solid rgba(64, 196, 255, 0.3);
	border-radius: 12px;
	padding: 1rem;
	cursor: pointer;
	transition: all 0.3s ease;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.5rem;
}

.major-class-item:hover {
	transform: translateY(-5px);
	background: rgba(64, 196, 255, 0.2);
	border-color: var(--primary-light);
	box-shadow: 0 5px 15px rgba(64, 196, 255, 0.3);
}

.major-class-item.active {
	background: rgba(64, 196, 255, 0.3);
	border-color: var(--primary-light);
	box-shadow: 0 0 20px rgba(64, 196, 255, 0.5);
}

.class-icon {
	font-size: 2rem;
}

.class-name {
	font-size: 0.9rem;
	font-weight: bold;
	color: var(--text-primary);
	text-align: center;
}

.class-count {
	font-size: 0.8rem;
	color: var(--text-secondary);
}

/* 筛选条件 */
.filter-container {
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
}

.filter-item {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
}

.filter-label {
	font-size: 1rem;
	color: var(--text-primary);
	font-weight: 500;
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

/* 复选框组 */
.checkbox-group {
	display: flex;
	flex-wrap: wrap;
	gap: 1rem;
}

.checkbox-item {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	cursor: pointer;
	color: var(--text-primary);
}

.checkbox-input {
	width: 18px;
	height: 18px;
	accent-color: var(--primary-light);
	cursor: pointer;
}

.checkbox-label {
	font-size: 1rem;
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
}

.reset-btn:hover {
	background: rgba(255, 87, 34, 0.2);
	transform: translateY(-2px);
	box-shadow: 0 5px 15px rgba(255, 87, 34, 0.3);
}

.reset-icon {
	font-size: 1.2rem;
}

/* 筛选结果 */
.filter-result {
	text-align: center;
	padding: 1rem;
	background: rgba(64, 196, 255, 0.1);
	border: 1px solid rgba(64, 196, 255, 0.3);
	border-radius: 12px;
}

.result-text {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.5rem;
	font-size: 1.1rem;
}

.result-label {
	color: var(--text-secondary);
}

.result-count {
	color: var(--primary-light);
	font-weight: bold;
	font-size: 1.5rem;
	text-shadow: 0 0 10px rgba(64, 196, 255, 0.5);
}

/* 图表区域 */
.charts-section {
	display: flex;
	flex-direction: column;
	gap: 2rem;
}

.chart-card {
	padding: 1.5rem;
	border-radius: 12px;
	transition: all 0.3s ease;
}

.chart-card:hover {
	transform: translateY(-5px);
	box-shadow: 0 10px 30px rgba(64, 196, 255, 0.3);
}

.chart-title {
	font-size: 1.2rem;
	color: var(--text-primary);
	margin-bottom: 1rem;
	display: flex;
	align-items: center;
	gap: 0.5rem;
}

.chart-content {
	position: relative;
	width: 100%;
	height: 400px;
}

.chart-canvas {
	width: 100%;
	height: 100%;
	border-radius: 8px;
	overflow: hidden;
}

.debug-btn {
	position: absolute;
	top: 10px;
	right: 10px;
	background: rgba(64, 196, 255, 0.8);
	color: white;
	border: none;
	padding: 8px 16px;
	border-radius: 4px;
	cursor: pointer;
	font-size: 12px;
	z-index: 10;
	transition: background 0.3s ease;
}

.debug-btn:hover {
	background: rgba(64, 196, 255, 1);
}

/* 响应式设计 */
@media (max-width: 768px) {
	.major-analysis-container {
		padding: 0 1rem;
	}

	.main-title {
		font-size: 2rem;
	}

	.selector-card {
		padding: 1.5rem;
	}

	.chart-card {
		padding: 1rem;
	}

	.chart-content {
		height: 300px;
	}

	.major-class-grid {
		grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
	}

	.class-name {
		font-size: 0.8rem;
	}
}
</style>
