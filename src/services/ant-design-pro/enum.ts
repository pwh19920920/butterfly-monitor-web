const DatabaseTypeEnum = {
  0: 'Mysql',
};

const TaskTypeEnum = {
  1: 'sql',
  2: 'http',
};

const TaskStatusEnum = {
  0: '关闭',
  1: '开启',
};

const TaskAlertStatusEnum = {
  0: '关闭',
  1: '开启',
};

const TaskSampledEnum = {
  0: '关闭',
  1: '开启',
};

const AlertConfTypeEnum = {
  1: '数字',
  2: '字符串'
}

const TaskRecallStatusEnum = {
  1: '支持',
  2: '不支持'
}


export {TaskRecallStatusEnum, AlertConfTypeEnum, DatabaseTypeEnum, TaskTypeEnum, TaskStatusEnum, TaskAlertStatusEnum, TaskSampledEnum};
