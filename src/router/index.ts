import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import UniversityAnalysisView from "../views/UniversityAnalysisView.vue";
import MajorAnalysisView from "../views/MajorAnalysisView.vue";
import AdmissionPolicyView from "../views/AdmissionPolicyView.vue";
import EmploymentFurtherView from "../views/EmploymentFurtherView.vue";
import DataDownloadView from "../views/DataDownloadView.vue";

const router = createRouter({
	history: createWebHashHistory(),
	routes: [
		{
			path: "/",
			name: "home",
			component: HomeView
		},
		{
			path: "/university-analysis",
			name: "university-analysis",
			component: UniversityAnalysisView
		},
		{
			path: "/major-analysis",
			name: "major-analysis",
			component: MajorAnalysisView
		},
		{
			path: "/admission-policy",
			name: "admission-policy",
			component: AdmissionPolicyView
		},
		{
			path: "/employment-education",
			name: "employment-education",
			component: EmploymentFurtherView
		},
		{
			path: "/data-download",
			name: "data-download",
			component: DataDownloadView
		}
	]
});

export default router;
