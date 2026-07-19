# tailored-resume

## Purpose

基于目标职位要求与诊断问题，由 AI 生成可编辑的定制简历草稿，并以独立快照形式存储（与主简历解耦），供定向投递携带与后续回看。

## Requirements

### Requirement: AI 定向定制简历

当用户在诊断结果页选择「定向修改简历」时，系统 SHALL 跳转定制页并基于职位要求与诊断问题由 AI 生成一份定制简历草稿。

#### Scenario: 进入定制页并生成
- **WHEN** 用户在诊断结果页点击「定向修改简历」
- **THEN** 系统 SHALL 跳转 `pages/seeker/tailorResume` 并展示 AI 基于职位与诊断生成的优化后简历内容

#### Scenario: 生成期间加载状态
- **WHEN** AI 定制内容生成中
- **THEN** 页面 SHALL 展示加载状态，生成失败时展示错误提示并允许重试

### Requirement: 定制简历可编辑与保存

定制页 SHALL 允许用户手动调整 AI 生成的内容，并支持自动保存与手动保存两种方式。

#### Scenario: 手动编辑
- **WHEN** 用户在定制页修改任意字段
- **THEN** 系统 SHALL 接受编辑并反映在待投递内容中

#### Scenario: 自动保存
- **WHEN** 用户编辑后停顿或离开输入
- **THEN** 系统 SHALL 自动将当前内容保存为定制简历快照

#### Scenario: 手动保存
- **WHEN** 用户点击保存
- **THEN** 系统 SHALL 立即保存并给出保存成功反馈

### Requirement: 定制简历快照与主简历解耦

定制简历 SHALL 存储为独立快照（完整 JSON），不修改主简历，且每次定向投递对应独立快照。

#### Scenario: 不影响主简历
- **WHEN** 用户保存定制简历
- **THEN** 主简历（SeekerProfile 及其经历）SHALL 保持不变

#### Scenario: 快照独立
- **WHEN** 同一简历针对多个职位定制
- **THEN** 每个职位 SHALL 对应各自独立的定制简历快照，互不覆盖

### Requirement: 查看定制简历详情

系统 SHALL 支持按定制简历 id 查询其完整内容，供投递记录页回看。

#### Scenario: 读取定制简历
- **WHEN** 用户请求某定制简历详情且为其本人所有
- **THEN** 系统 SHALL 返回该定制简历的完整快照内容
