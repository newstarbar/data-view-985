// 按需引入 ECharts 核心模块
import * as echarts from "echarts/core";

// 引入柱状图、折线图、饼图等图表
import {
	BarChart,
	LineChart,
	PieChart,
	ScatterChart,
	RadarChart,
	TreeChart,
	TreemapChart,
	GraphChart,
	GaugeChart,
	FunnelChart,
	ParallelChart,
	SankeyChart,
	BoxplotChart,
	CandlestickChart,
	EffectScatterChart,
	LinesChart,
	HeatmapChart,
	PictorialBarChart,
	ThemeRiverChart,
	SunburstChart,
	CustomChart
} from "echarts/charts";

// 坐标系组件
import {
	GridComponent,
	PolarComponent,
	GeoComponent,
	SingleAxisComponent,
	ParallelComponent,
	CalendarComponent,
	GraphicComponent,
	ToolboxComponent,
	TooltipComponent,
	AxisPointerComponent,
	BrushComponent,
	TitleComponent,
	TimelineComponent,
	MarkPointComponent,
	MarkLineComponent,
	MarkAreaComponent,
	LegendComponent,
	LegendScrollComponent,
	LegendPlainComponent,
	DataZoomComponent,
	DataZoomInsideComponent,
	DataZoomSliderComponent,
	VisualMapComponent,
	VisualMapContinuousComponent,
	VisualMapPiecewiseComponent,
	AriaComponent,
	TransformComponent,
	DatasetComponent
} from "echarts/components";

// 引入渲染器
import { CanvasRenderer, SVGRenderer } from "echarts/renderers";

// 引入 echarts-gl
import "echarts-gl";

// 移除地图相关代码

// 注册所有组件
echarts.use([
	// 核心组件
	CanvasRenderer,
	SVGRenderer,
	// 图表类型
	BarChart,
	LineChart,
	PieChart,
	ScatterChart,
	RadarChart,
	TreeChart,
	TreemapChart,
	GraphChart,
	GaugeChart,
	FunnelChart,
	ParallelChart,
	SankeyChart,
	BoxplotChart,
	CandlestickChart,
	EffectScatterChart,
	LinesChart,
	HeatmapChart,
	PictorialBarChart,
	ThemeRiverChart,
	SunburstChart,
	CustomChart,
	// 坐标系组件
	GridComponent,
	PolarComponent,
	GeoComponent,
	SingleAxisComponent,
	ParallelComponent,
	CalendarComponent,
	GraphicComponent,
	ToolboxComponent,
	TooltipComponent,
	AxisPointerComponent,
	BrushComponent,
	TitleComponent,
	TimelineComponent,
	MarkPointComponent,
	MarkLineComponent,
	MarkAreaComponent,
	LegendComponent,
	LegendScrollComponent,
	LegendPlainComponent,
	DataZoomComponent,
	DataZoomInsideComponent,
	DataZoomSliderComponent,
	VisualMapComponent,
	VisualMapContinuousComponent,
	VisualMapPiecewiseComponent,
	AriaComponent,
	TransformComponent,
	DatasetComponent
]);

// 导出 ECharts 实例和类型
export default echarts;
export type { EChartsCoreOption } from "echarts/core";
