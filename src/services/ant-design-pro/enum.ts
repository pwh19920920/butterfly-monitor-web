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

const AlertChannelTypeEnum = {
  1: '邮件',
  2: 'WebHook',
  3: '短信'
}


const AlertChannelFailRouteEnum = {
  1: '否',
  2: '是',
}

const AlertChannelSSlEnum = {
  1: '是',
  2: '否',
}

export {AlertChannelTypeEnum, AlertChannelSSlEnum, AlertChannelFailRouteEnum, TaskRecallStatusEnum, AlertConfTypeEnum, DatabaseTypeEnum, TaskTypeEnum, TaskStatusEnum, TaskAlertStatusEnum, TaskSampledEnum};
