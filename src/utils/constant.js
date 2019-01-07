export const OPERATION_MENU_OPTIONS = {
  ADD: "ADD_NODE_CHILD",
  EDIT: "EDIT_NODE",
  DELETE: "DELETE_NODE"
};
export const OPERATION_ROLE_OPTIONS = {
  ADD: "ADD_ROLE",
  EDIT: "EDIT_ROLE",
  DELETE: "DELETE_ROLE"
};
export const OPERATION_USER_OPTIONS = {
  ADD: "ADD_USER",
  EDIT: "EDIT_USER",
  DELETE: "DELETE_USER"
};

export const HIERARCHY_MODAL_TITLE = {
  [OPERATION_MENU_OPTIONS.ADD]: "新增下一层级",
  [OPERATION_MENU_OPTIONS.EDIT]: "编辑本层级",
  [OPERATION_MENU_OPTIONS.DELETE]: "删除本层级"
};

export const OPERATION_ROLE_MODAL_TITLE = {
  [OPERATION_ROLE_OPTIONS.ADD]: "新增角色",
  [OPERATION_ROLE_OPTIONS.EDIT]: "编辑角色",
  [OPERATION_ROLE_OPTIONS.DELETE]: "删除角色"
};
export const OPERATION_USER_MODAL_TITLE = {
  [OPERATION_USER_OPTIONS.ADD]: "新增用户",
  [OPERATION_USER_OPTIONS.EDIT]: "编辑用户",
  [OPERATION_USER_OPTIONS.DELETE]: "删除用户"
};
export const ORGANIZATION_MENU_TITLE = {
  [OPERATION_MENU_OPTIONS.ADD]: "新增下一层组织",
  [OPERATION_MENU_OPTIONS.EDIT]: "编辑本层组织",
  [OPERATION_MENU_OPTIONS.DELETE]: "删除本层组织"
};

export const LOADING_STATUS = {
  LOADING: "LOADING",
  SUCCESS: "SUCCESS",
  FAILED: "FAILED"
};
export const OPERATION_ORGANIZATION_MODAL_TITLE = "配置本组织权限";
export const ERROR = {
  REQUIRED: "信息不能为空",
  INPUT: "信息填写错误",
  USER_DUPLICATED: "不能与已有用户相同",
  HIERARCHY_NAME_MAX_LIMIT: "层级名称不能超过6个字",
  NETWORK: "服务器出错，请稍后重试",
  VALIDATE_FAILED: "校验失败，请稍后重试",
  INPUT_DUPLICATED: "不能与输入框已有信息重复",
  UNKNOWN_ERROR: "未知错误！"
};

export const DATA_ENTRANCE_MENU_NAME = {
  SAMPLE: "data-sample-inspection",
  FULL: "data-full-inspection"
};

export const DATA_ENTRANCE_MENUS = [
  {
    name: DATA_ENTRANCE_MENU_NAME.SAMPLE,
    to: { name: DATA_ENTRANCE_MENU_NAME.SAMPLE },
    label: "抽检"
  },
  {
    name: DATA_ENTRANCE_MENU_NAME.FULL,
    to: { name: DATA_ENTRANCE_MENU_NAME.FULL },
    label: "全检"
  }
];

export const UNQUALIFIED_CATEGORY = ["A", "B", "C", "D", "E"];

export const REPORT_FILTER_TYPE = [
  {
    value: "VENDOR",
    label: "按供应商合格率查看",
    title: "按供应商合格率来筛选",
    content: [
      "1. 筛选计算: 筛选满足“时间”“供应商”“物料组”的抽检数据，按照供应商纬度进行聚类。",
      "2. 数据过滤: 计算结果符合“合格率”、“不合格批数”、“不合格类别”、“不合格原因”中任一条件的数据过滤并展示出来。"
    ]
  },
  {
    value: "MATERIAL_GROUP",
    label: "按物料组合格率查看",
    title: "按物料组合格率来筛选",
    content: [
      "1. 筛选计算：筛选满足“时间”“供应商”“物料组”的抽检数据，按照物料组维度进行聚类。",
      "2. 数据过滤：计算结果符合“合格率”、“不合格批数”、“不合格类别”、“不合格原因”中任一条件的数据过滤并展示出来。”"
    ]
  },
  {
    value: "MATERIAL_GROUP_AND_INSPECTOR",
    label: "按物料组+检验员合格率查看",
    title: "按物料组+检验员合格率来筛选",
    content: [
      "1. 筛选计算: 筛选满足“时间”“供应商”“物料组”“检验员”的抽检数据，按照物料组+检验员维度进行聚类。",
      "2. 数据过滤: 计算结果符合“合格率”、“不合格批数”、“不合格类别”、“不合格原因”中任一条件的数据过滤并展示出来。”"
    ]
  }
];
export const DETAIL_FILTER_TIP = {
  title: "按单批中各项细项来筛选",
  content: [
    "筛选满足“时间”“供应商”“物料组”“检验员”“检验结论”“不合格类别”“不合格原因”的抽检明细数据并展示出来。"
  ]
};

export const COLUMN_NAME_MAP = new Map([
  [
    "VENDOR",
    {
      title: "供应商",
      key: "vendor"
    }
  ],
  [
    "MATERIAL_GROUP",
    {
      title: "物料组",
      key: "materialGroup"
    }
  ],
  [
    "MATERIAL_GROUP_AND_INSPECTOR",
    {
      title: "占位文字",
      key: "占位KEY"
    }
  ]
]);

export const INSPECTION_TYPE = {
  FULL: "FULL",
  SAMPLE: "SAMPLE"
};
