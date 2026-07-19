# job-delivery 规格增量

## ADDED Requirements

### Requirement: 定向投递

系统 SHALL 支持定向投递：携带定制简历快照投递到目标职位，与普通投递区分。

#### Scenario: 定向投递成功
- **WHEN** 用户在定制页确认投递且定制简历已保存
- **THEN** 系统 SHALL 创建一条投递记录，类型为 TARGETED 并关联该定制简历快照，返回投递成功反馈

#### Scenario: 防重复提交
- **WHEN** 投递请求进行中或该用户已投递过该职位
- **THEN** 系统 SHALL 阻止重复投递并给出相应提示

#### Scenario: 直接投递保持普通类型
- **WHEN** 用户在诊断结果页选择「直接投递」
- **THEN** 系统 SHALL 创建类型为 NORMAL 的投递记录，不关联定制简历

### Requirement: 定向投递专区

「我的投递」页 SHALL 提供「定向投递」专区，列表展示职位名称、公司信息、投递时间与当前状态。

#### Scenario: 展示定向投递列表
- **WHEN** 用户进入「我的投递」的定向投递专区
- **THEN** 系统 SHALL 仅展示 type 为 TARGETED 的投递记录，含职位名、公司、投递时间、状态

#### Scenario: 查看定向投递的简历详情
- **WHEN** 用户点击某条定向投递记录
- **THEN** 系统 SHALL 展示该次投递所关联定制简历的完整详情
