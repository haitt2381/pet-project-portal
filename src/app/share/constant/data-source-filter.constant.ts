import {DataSourceFilter} from "../model/common/data-source-filter.model";
import {Role} from "./role.constant";

export const dataSourceRoleFilter: DataSourceFilter[] = [
  {
    text: `<span class="badge badge-warning rounded-pill d-inline">${Role.ADMIN}</span>`,
    value: Role.ADMIN.toUpperCase()
  },
  {
    text: `<span class="badge badge-success rounded-pill d-inline">${Role.MODERATOR}</span>`,
    value: Role.MODERATOR.toUpperCase()
  },
  {
    text: `<span class="badge badge-primary rounded-pill d-inline">${Role.MEMBER}</span>`,
    value: Role.MEMBER.toUpperCase()
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
