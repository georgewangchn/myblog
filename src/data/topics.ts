// ── 主题聚合页配置（用于 GEO：可抓取的主题 hub）──

export interface TopicDef {
	slug: string;
	title: string;
	description: string;
	keywords: string;
	intro: string;
	highlights: string[];
	match: (post: Matchable) => boolean;
}

export interface Matchable {
	id: string;
	tags?: string[];
	category: string;
}

const hasTag = (tags: string[] | undefined, needles: string[]) =>
	(tags || []).some((t) => needles.some((n) => t.toLowerCase().includes(n)));

export const topics: TopicDef[] = [
	{
		slug: 'palantir',
		title: 'Palantir 研究',
		description:
			'从 Palantir 官网与产品文档出发，拆解 Foundry、Ontology、AIP、HyperAuto 如何构成从数据到行动的完整闭环，以及企业用 AI 该向内做什么。',
		keywords: 'Palantir,Foundry,Ontology,AIP,HyperAuto,企业AI,本体推理',
		intro:
			'Palantir 的核心不是某个产品，而是一套「数据 → 语义 → 规则 → 动作 → 反馈」的闭环。本主题收录对该路线的系统拆解：它的本体如何从数据工程里长出来，以及企业借 AI 向内改造业务的正确姿势。',
		highlights: [
			'Palantir 把业务动作放进了语义层，让系统从「分析型」走向「操作型」',
			'本体不是白板设计出来的，而是在长期数据工程与结构化业务系统上长出来的',
			'企业用 AI 的价值不在下一个模型，而在借机砍掉多余流程、收回失控的权力',
		],
		match: (p) => p.id.startsWith('palantir') || hasTag(p.tags, ['palantir']),
	},
	{
		slug: 'ontology',
		title: '本体推理',
		description:
			'本体推理（Ontology Reasoning）是什么？OWL / SWRL / HermiT、知识图谱与企业本体建模的实践笔记与系列文章。',
		keywords: '本体推理,Ontology,OWL,SWRL,HermiT,知识图谱,知识工程,语义网',
		intro:
			'本体推理不等于知识图谱——推理能力才是本体的灵魂。本主题收录本体建模、OWL 公理体系、SWRL 规则、HermiT 推理机，以及用本体承接企业业务语义与动作的实践文章。',
		highlights: [
			'OWL + SWRL + HermiT：用形式化逻辑表达业务规则并自动推理',
			'本体承载企业世界中的对象、关系、状态、规则与动作',
			'当 LLM 不够用，用确定性的推理层补上',
		],
		match: (p) =>
			hasTag(p.tags, ['ontology', '本体', 'owl', 'swrl', 'hermit', '知识图谱', '知识工程']) ||
			['p1', 'p2', 'p3'].includes(p.id),
	},
	{
		slug: 'reasoning',
		title: '多范式推理实战',
		description:
			'同一个问题，多种推理范式——OWL/HermiT、Prolog、Jena/SPARQL、模糊逻辑、贝叶斯、多范式仲裁的对比与实战。',
		keywords: '多范式推理,OWL,Prolog,SPARQL,Jena,模糊逻辑,贝叶斯,仲裁,推理引擎',
		intro:
			'不为比较优劣，只为理解每种推理范式的思维方式与适用边界。本主题收录 P1–P6 推理范式系列与 PL1–PL6 的 Agent 化变体，覆盖从确定性逻辑到概率与模糊推理的完整光谱。',
		highlights: [
			'P1–P6：OWL、Prolog、SPARQL、模糊、贝叶斯、多范式仲裁',
			'PL1–PL6：把每种推理引擎用 LLM Agent 包装',
			'同一诊断问题，六种解法，理解范式的适用边界',
		],
		match: (p) =>
			/^p[1-6]/.test(p.id) ||
			/^pl[1-6]/.test(p.id) ||
			hasTag(p.tags, ['owl', 'prolog', 'jena', 'sparql', '模糊', '贝叶斯', '仲裁']),
	},
	{
		slug: 'agent',
		title: 'LLM Agent 与推理融合',
		description:
			'LLM Agent 如何调用推理引擎？工具调用、多引擎融合、Agent 架构设计与企业级落地的实践文章。',
		keywords: 'LLM,Agent,工具调用,推理引擎,LangGraph,多引擎融合,企业落地',
		intro:
			'Agent 解决的是“谁来触发”。本主题收录 LLM Agent 与各种推理引擎融合的实践：当 Agent 后面有一个已经长出来的业务世界，它才真正有“手”。',
		highlights: [
			'LLM Agent + OWL / Prolog / SPARQL / 模糊 / 贝叶斯推理引擎',
			'多引擎分层仲裁与冲突消解',
			'Agent 后面有没有一个长出来的业务世界，才是关键',
		],
		match: (p) =>
			/^pl[1-6]/.test(p.id) ||
			hasTag(p.tags, ['agent']) ||
			p.category.split(',').map((c) => c.trim()).includes('agent'),
	},
];

export function matchTopics(post: Matchable): TopicDef[] {
	return topics.filter((t) => t.match(post));
}
