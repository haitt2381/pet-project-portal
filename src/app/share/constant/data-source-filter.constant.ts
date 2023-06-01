import {DataSourceFilter} from "../model/common/data-source-filter.model";
import {Role} from "./role.constant";

export const dataSourceRoleFilter: DataSourceFilter[] = [
  {
    text: `<span class="badge badge-warning rounded-pill d-inline">${Role.AD}</span>`,
    value: Role.AD.toUpperCase()
  },
  {
    text: `<span class="badge badge-success rounded-pill d-inline">${Role.MOD}</span>`,
    value: Role.MOD.toUpperCase()
  },
  {
    text: `<span class="badge badge-primary rounded-pill d-inline">${Role.MEM}</span>`,
    value: Role.MEM.toUpperCase()
  }
];

export const dataSourceActiveFilter: DataSourceFilter[] = [
  {
    text: `<span>Active</span>`,
    value: "true"
  },
  {
    text: `<span>Deactivate</span>`,
    value: "false"
  },
]
