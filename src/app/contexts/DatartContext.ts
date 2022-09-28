import { createContext } from 'react';
import { DatartComponentConfig } from '../../utils/globalState';


export const DatartContext = createContext<DatartComponentConfig>({} as DatartComponentConfig);
