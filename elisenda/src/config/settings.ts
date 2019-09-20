export interface Settings {
  defaultPort: number;
  socketPath: string;  
}


const settings: Settings = {
  defaultPort: 9230,
  socketPath: '/ws',  
};

export default settings;
