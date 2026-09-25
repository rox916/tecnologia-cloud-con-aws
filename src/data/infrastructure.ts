import type { AvailabilityZone, DataCenter, EdgeLocation } from "../types/cloud";

export const availabilityZones: AvailabilityZone[] = [
  { id: "use1-az1", regionId: "us-east-1", name: "US East (N. Virginia) 1", code: "use1-az1", status: "success", dataCenterCount: 3 },
  { id: "use1-az2", regionId: "us-east-1", name: "US East (N. Virginia) 2", code: "use1-az2", status: "success", dataCenterCount: 3 },
  { id: "use1-az4", regionId: "us-east-1", name: "US East (N. Virginia) 4", code: "use1-az4", status: "success", dataCenterCount: 4 },
  { id: "usw2-az1", regionId: "us-west-2", name: "US West (Oregon) 1", code: "usw2-az1", status: "success", dataCenterCount: 3 },
  { id: "usw2-az2", regionId: "us-west-2", name: "US West (Oregon) 2", code: "usw2-az2", status: "success", dataCenterCount: 3 },
  { id: "sae1-az1", regionId: "sa-east-1", name: "South America (São Paulo) 1", code: "sae1-az1", status: "warning", dataCenterCount: 2 },
  { id: "euw1-az1", regionId: "eu-west-1", name: "Europe (Ireland) 1", code: "euw1-az1", status: "success", dataCenterCount: 3 },
  { id: "euw1-az2", regionId: "eu-west-1", name: "Europe (Ireland) 2", code: "euw1-az2", status: "success", dataCenterCount: 3 },
  { id: "apse1-az1", regionId: "ap-southeast-1", name: "Asia Pacific (Singapore) 1", code: "apse1-az1", status: "danger", dataCenterCount: 2 },
  { id: "apne1-az1", regionId: "ap-northeast-1", name: "Asia Pacific (Tokyo) 1", code: "apne1-az1", status: "success", dataCenterCount: 3 },
  { id: "cac1-az1", regionId: "ca-central-1", name: "Canada (Central) 1", code: "cac1-az1", status: "success", dataCenterCount: 2 },
  { id: "euc1-az1", regionId: "eu-central-1", name: "Europe (Frankfurt) 1", code: "euc1-az1", status: "success", dataCenterCount: 3 },
];

export const dataCenters: DataCenter[] = [
  { id: "dc-ashburn-1", regionId: "us-east-1", name: "Ashburn Campus", city: "Ashburn, Virginia", status: "success", purpose: "Cómputo y almacenamiento" },
  { id: "dc-columbus-1", regionId: "us-east-1", name: "Columbus Campus", city: "Columbus, Ohio", status: "success", purpose: "Bases de datos y respaldo" },
  { id: "dc-portland-1", regionId: "us-west-2", name: "Portland Campus", city: "Boardman, Oregon", status: "success", purpose: "Cómputo y almacenamiento" },
  { id: "dc-sao-paulo-1", regionId: "sa-east-1", name: "São Paulo Campus", city: "São Paulo, Brasil", status: "warning", purpose: "Servicios regionales" },
  { id: "dc-dublin-1", regionId: "eu-west-1", name: "Dublin Campus", city: "Dublín, Irlanda", status: "success", purpose: "Datos y aplicaciones europeas" },
  { id: "dc-singapore-1", regionId: "ap-southeast-1", name: "Singapore Campus", city: "Singapur", status: "danger", purpose: "Capacidad en revisión" },
  { id: "dc-tokyo-1", regionId: "ap-northeast-1", name: "Tokyo Campus", city: "Tokio, Japón", status: "success", purpose: "Cargas empresariales" },
  { id: "dc-montreal-1", regionId: "ca-central-1", name: "Montréal Campus", city: "Montreal, Canadá", status: "success", purpose: "Datos regulados" },
  { id: "dc-frankfurt-1", regionId: "eu-central-1", name: "Frankfurt Campus", city: "Fráncfort, Alemania", status: "success", purpose: "Aplicaciones europeas" },
];

export const edgeLocations: EdgeLocation[] = [
  { id: "edge-washington", regionId: "us-east-1", name: "Washington, DC", city: "Washington, DC", country: "Estados Unidos", services: ["CloudFront", "Route 53"] },
  { id: "edge-new-york", regionId: "us-east-1", name: "New York", city: "Nueva York", country: "Estados Unidos", services: ["CloudFront", "Route 53"] },
  { id: "edge-seattle", regionId: "us-west-2", name: "Seattle", city: "Seattle", country: "Estados Unidos", services: ["CloudFront"] },
  { id: "edge-sao-paulo", regionId: "sa-east-1", name: "São Paulo Edge", city: "São Paulo", country: "Brasil", services: ["CloudFront", "Route 53"] },
  { id: "edge-dublin", regionId: "eu-west-1", name: "Dublin Edge", city: "Dublín", country: "Irlanda", services: ["CloudFront", "Route 53"] },
  { id: "edge-singapore", regionId: "ap-southeast-1", name: "Singapore Edge", city: "Singapur", country: "Singapur", services: ["CloudFront"] },
  { id: "edge-tokyo", regionId: "ap-northeast-1", name: "Tokyo Edge", city: "Tokio", country: "Japón", services: ["CloudFront", "Route 53"] },
  { id: "edge-toronto", regionId: "ca-central-1", name: "Toronto Edge", city: "Toronto", country: "Canadá", services: ["CloudFront"] },
  { id: "edge-frankfurt", regionId: "eu-central-1", name: "Frankfurt Edge", city: "Fráncfort", country: "Alemania", services: ["CloudFront", "Route 53"] },
];