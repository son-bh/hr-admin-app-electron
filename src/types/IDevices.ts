export interface IDevices {
  employee: {
    employeeId: string;
    role: string;
    team: string;
    username: string;
    updatedAt: string;
    createdAt: string;
  };
  materials: Material[];
  _id: string;
}
export interface Material {
  _id?: string;
  note?: string;
  device?: string;
  code?: string;
  updatedAt?: string;
  createdAt?: string;
  actionBy: {
    username: string;
  };
  onboardAt: string;
}
export interface AssignMaterialsPayload {
  employeeId: string;
  code: string;
  note: string;
  device: string;
}
export interface UpdateMaterialsPayload {
  materialId: string;
  code: string;
  note: string;
  device: string;
}
export type DetailMaterialPayLoad = Material & {
  materialId: string;
};
