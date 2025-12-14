// 高校基础信息维度
export interface UniversityBaseInfo {
  schoolId: string; // 唯一标识ID（如"Tsinghua-001"）
  schoolName: string; // 院校全称（含校区标注，如"哈尔滨工业大学（深圳）"）
  shortName: string; // 院校简称（如"哈工大深圳"）
  region: string; // 所属区域（华北、华东等）
  province: string; // 所在省份
  city: string; // 所在城市
  type: string; // 高校类型（综合类、理工类等）
  subType: string; // 高校子类型（研究型、研究教学型等）
  establishedYear: number; // 建校年份
  worldRank: number; // 世界排名（如QS排名）
  nationalRank: number; // 国内排名（如校友会排名）
  doubleFirstClass: boolean; // 是否"双一流"建设高校
  specialProject: string[]; // 特殊项目（如"珠峰计划"、"基础学科拔尖学生培养计划"）
  keyDisciplines: string[]; // 国家重点学科
  logo: string; // 校徽URL
}

// 招生计划维度
export interface ProvincialPlan {
  provinceId: number;
  plan: number;
  planPer1000: number; // 每千名考生计划数
}

export interface CategoryPlan {
  category: string;
  plan: number;
  percentage: number; // 占总计划比例
}

export interface DepartmentPlan {
  departmentId: string;
  departmentName: string;
  plan: number;
}

export interface SpecialPlan {
  planType: string;
  plan: number;
  targetRegions: string[]; // 目标地区
}

export interface AdmissionPlan {
  year: number; // 招生年份
  totalPlan: number; // 本科招生总计划数
  provincialPlan: Record<string, ProvincialPlan>; // 分省招生计划
  categoryPlan: Record<string, CategoryPlan>; // 招生类别计划
  departmentPlan: Record<string, DepartmentPlan>; // 院系招生计划
  specialPlan: Record<string, SpecialPlan>; // 专项计划
  internationalPlan: number; // 国际生招生计划
  genderPlan: {
    male: number;
    female: number;
  };
}

// 录取分数线与位次维度
export interface ProvincialScore {
  provinceId: number;
  provinceName: string;
  category: string; // 科类（如"理工"、"文史"、"综合改革"）
  batch: string; // 批次（本科提前批、本科一批等）
  minScore: number; // 最低录取分
  maxScore: number; // 最高录取分
  avgScore: number; // 平均录取分
  minRank: number; // 最低录取位次
  maxRank: number; // 最高录取位次
  avgRank: number; // 平均录取位次
}

export interface DepartmentScore {
  departmentId: string;
  departmentName: string;
  minScore: number;
  maxScore: number;
  avgScore: number;
}

export interface MajorScore {
  majorId: string;
  majorName: string;
  minScore: number;
  maxScore: number;
  avgScore: number;
  minRank: number;
  maxRank: number;
}

export interface ScoreSegment {
  segment: string; // 分数段（如"600-610"）
  count: number; // 该分数段录取人数
  percentage: number; // 占比
}

export interface AdmissionScore {
  year: number; // 录取年份
  provincialScore: Record<string, ProvincialScore>; // 分省录取数据
  departmentScore: Record<string, DepartmentScore>; // 院系录取数据
  majorScore: Record<string, MajorScore>; // 专业录取数据
  scoreSegment: Record<string, ScoreSegment>; // 分数段分布
  scoreLineDifference: number; // 录取线与批次线差值（线差）
  rankDifference: number; // 录取位次与批次线位次差值（位次差）
}

// 生源结构维度
export interface ProvincialDistribution {
  provinceId: number;
  provinceName: string;
  count: number;
  percentage: number;
}

export interface GenderRatio {
  male: number; // 男生人数
  female: number; // 女生人数
  ratio: number; // 男:女比例
}

export interface EthnicDistribution {
  ethnic: string;
  count: number;
  percentage: number;
}

export interface HighSchoolSource {
  highSchoolId: string;
  highSchoolName: string;
  count: number;
  percentage: number;
}

export interface ScoreLevel {
  level: string;
  count: number;
  percentage: number;
}

export interface AdmissionChannel {
  channel: string;
  count: number;
  percentage: number;
}

export interface EnrollmentSources {
  year: number; // 年份
  provincialDistribution: Record<string, ProvincialDistribution>; // 省份生源分布
  genderRatio: GenderRatio; // 性别比例
  ethnicDistribution: Record<string, EthnicDistribution>; // 民族分布
  highSchoolSources: Record<string, HighSchoolSource>; // 高中生源分布
  scoreLevel: Record<string, ScoreLevel>; // 生源分数水平
  admissionChannel: Record<string, AdmissionChannel>; // 录取渠道分布
}

// 特殊招生类型维度
export interface SpecialAdmission {
  year: number; // 年份
  type: string; // 特殊招生类型（强基计划、综合评价、高校专项等）
  plan: number; // 计划数
  admitted: number; // 录取数
  admissionRate: number; // 录取率
  majorList: string[]; // 招生专业列表
  scoreRequirement: {
    minScore: number;
    avgScore: number;
  };
  selectionCriteria: string; // 选拔标准（如"高考成绩+面试+体测"）
  enrollmentRegions: string[]; // 招生区域
}

// 专业详情维度
export interface MajorProfile {
  majorId: string; // 专业代码
  majorName: string; // 专业名称
  category: string; // 学科门类（如理学、工学）
  subCategory: string; // 专业类（如计算机类、机械类）
  introduction: string; // 专业介绍
  faculty: number; // 专业师资数量（教授、副教授等）
  laboratories: number; // 实验室数量
  keyLaboratory: boolean; // 是否国家重点实验室
  disciplineEvaluation: string; // 学科评估结果（A+、A等）
  employmentRate: number; // 就业率
  furtherStudyRate: number; // 深造率
  avgSalary: number; // 平均起薪
  topUniversities: string[]; // 该专业顶尖院校
  admissionScore: Omit<MajorScore, 'majorId' | 'majorName'>; // 专业录取分数
  selectSubjectRequirements: string[]; // 选科要求（如"物理+化学"）
}

// 就业与深造维度
export interface EmploymentSector {
  sector: string;
  percentage: number;
}

export interface EmploymentRegion {
  region: string;
  percentage: number;
}

export interface KeyEnterprise {
  enterprise: string;
  count: number;
}

export interface EmploymentQuality {
  avgSalary: number; // 平均薪资
  employmentSectors: Record<string, EmploymentSector>; // 就业行业分布
  employmentRegions: Record<string, EmploymentRegion>; // 就业地区分布
  keyEnterprises: Record<string, KeyEnterprise>; // 重点就业单位
}

export interface FurtherStudyType {
  type: string;
  percentage: number;
}

export interface GraduateSchool {
  schoolId: string;
  schoolName: string;
  percentage: number;
}

export interface AbroadUniversity {
  country: string;
  university: string;
  percentage: number;
}

export interface EmploymentAndFurtherStudy {
  year: number; // 毕业年份
  employmentRate: number; // 总体就业率
  employmentQuality: EmploymentQuality; // 就业质量指标
  furtherStudyRate: number; // 深造率
  furtherStudyTypes: Record<string, FurtherStudyType>; // 深造类型分布
  graduateSchoolDistribution: Record<string, GraduateSchool>; // 读研院校分布
  abroadUniversityDistribution: Record<string, AbroadUniversity>; // 出国深造院校分布
}

// 完整的数据结构
export interface UniversityData {
  universityBaseInfo: UniversityBaseInfo;
  admissionPlan: Record<string, AdmissionPlan>; // 按年份索引
  admissionScore: Record<string, AdmissionScore>; // 按年份索引
  enrollmentSources: Record<string, EnrollmentSources>; // 按年份索引
  specialAdmission: Record<string, SpecialAdmission>; // 按年份和类型索引
  majorProfiles: Record<string, MajorProfile>; // 按专业ID索引
  employmentAndFurtherStudy: Record<string, EmploymentAndFurtherStudy>; // 按毕业年份索引
}

// 数据查询参数
export interface DataQueryParams {
  years?: number[];
  universities?: string[];
  provinces?: string[];
  regions?: string[];
  types?: string[];
  majors?: string[];
  categories?: string[];
}
