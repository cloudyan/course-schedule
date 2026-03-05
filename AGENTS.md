# 课程表项目 - 开发指南

## 交互要求

- **所有思考过程**必须用**中文**表述
- **所有回答内容**必须用**中文**回复
- **代码注释**建议使用中文
- **技术文档**必须使用专业中文术语

## 项目技术栈

- **前端**: React 19 + TypeScript + Vite
- **样式**: Tailwind CSS 4
- **动画**: Framer Motion
- **图标**: Lucide React
- **后端**: Express + Better SQLite3
- **AI**: Google GenAI

## 构建命令

```bash
# 开发服务器 (端口 3000)
npm run dev

# 生产构建
npm run build

# 预览构建结果
npm run preview

# 类型检查
npm run lint

# 清理构建产物
npm run clean
```

## 代码风格指南

### 导入规范

- 使用 `@/` 路径别名引用 `src/` 下的文件
- 导入组件文件时必须包含 `.tsx` 扩展名
- 导入顺序：React 核心 → 第三方库 → 本地模块
- 移除未使用的导入

### 命名约定

- 接口/类型: `PascalCase` (如 `Course`, `TimeSlot`)
- 常量: `UPPER_SNAKE_CASE` (如 `SUBJECT_COLORS`)
- 函数/变量: `camelCase` (如 `getSubjectColor`, `selectedDate`)
- 组件: `PascalCase` (如 `App`)

### TypeScript 使用

- 定义接口而非类型别名（除非需要联合类型）
- 避免使用 `any`，使用 `unknown` 或具体类型
- 开启严格模式（tsconfig.json 已配置）

### React 模式

- 使用函数组件 + Hooks
- 状态管理：`useState`, `useMemo`, `useRef`
- 条件渲染使用三元运算符或逻辑与
- 列表渲染需要唯一 key

### 样式规范

- 使用 Tailwind CSS 类名
- 遵循 docs/design_system.md 中的学科配色系统
- 确保颜色对比度符合 WCAG AA 标准
- 自定义颜色在 `@theme` 中定义，使用 CSS 变量访问

### 学科配色系统

| 学科 | 颜色 |
|------|------|
| 语文 | #FEE2E2 (红-100) / #991B1B (红-800) |
| 数学 | #DBEAFE (蓝-100) / #1E40AF (蓝-800) |
| 英语 | #F3E8FF (紫-100) / #6B21A8 (紫-800) |
| 物理 | #CCFBF1 (翡翠-100) / #065F46 (翡翠-800) |
| 化学 | #FEF3C7 (琥珀-100) / #92400E (琥珀-800) |
| 生物 | #D1FAE5 (绿-100) / #065F46 (绿-800) |
| 历史 | #E0E7FF (靛蓝-100) / #3730A3 (靛蓝-800) |
| 地理 | #FCE7F3 (粉红-100) / #9D174D (粉红-800) |
| 政治 | #FBCFE8 (玫瑰-100) / #9F1239 (玫瑰-800) |
| 体育 | #C7D2FE (靛蓝-200) / #3730A3 (靛蓝-800) |
| 音乐 | #FDE68A (琥珀-200) / #92400E (琥珀-800) |
| 美术 | #FDD6E4 (粉红-200) / #9D174D (粉红-800) |
| 自习 | #F3F4F6 (灰-100) / #374151 (灰-700) |
| 其他 | #E5E7EB (灰-200) / #374151 (灰-800) |

### 环境变量

- `GEMINI_API_KEY`: Google AI API 密钥（通过 `.env.local` 设置）
- `DISABLE_HMR`: 设置为 `true` 可禁用热模块替换

### Git 提交

- 提交前确保 `npm run lint` 通过
- 提交信息使用中文，简洁描述变更
