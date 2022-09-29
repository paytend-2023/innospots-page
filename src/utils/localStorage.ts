export const LOCAL_DATA_KEY = 'INNOSPOT_DATA';

const get = (key?: string): any => {
    let ls = {};

    if (window.localStorage) {
        try {
            ls = JSON.parse(window.localStorage.getItem(LOCAL_DATA_KEY) as string) || {};
        } catch (e) {
        }
    }

    return key ? ls[key] : ls;
};

const set = (key: string, value: any) => {
    if (window.localStorage) {
        const data = get();
        data[key] = value;

        if (value === null) {
            delete data[key];
        }

        window.localStorage.setItem(
            LOCAL_DATA_KEY,
            JSON.stringify(data)
        );
    }
}

const remove = (key: string) => {
    set(key, null)
}

export default {
    get, set, remove, LOCAL_DATA_KEY
}
