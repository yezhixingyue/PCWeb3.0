import Vue from 'vue';

import {
  Dialog, Dropdown, DropdownMenu, DropdownItem, Select, Option, Steps, Step, Popover, Link, Radio, Collapse, Upload,
  CollapseItem, RadioGroup, Tabs, TabPane, Message, Input, Form, FormItem, Button, CheckboxGroup, Checkbox, Progress,
  Table, TableColumn, Tooltip, DatePicker, RadioButton, Pagination, Image, Loading, Backtop, Icon, Drawer,
} from 'element-ui';

Vue.use(Select);
Vue.use(Option);
Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Dialog);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Input);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Button);
Vue.use(CheckboxGroup);
Vue.use(Checkbox);
Vue.use(Steps);
Vue.use(Step);
Vue.use(Popover);
Vue.use(Link);
Vue.use(RadioGroup);
Vue.use(Radio);
Vue.use(CollapseItem);
Vue.use(Collapse);
Vue.use(Upload);
Vue.use(Progress);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Tooltip);
Vue.use(DatePicker);
Vue.use(RadioButton);
Vue.use(Pagination);
Vue.use(Image);
Vue.use(Backtop);
Vue.use(Icon);
Vue.use(Drawer);

Vue.use(Loading.directive);
Vue.prototype.$message = Message;

// Vue.use(Element);
