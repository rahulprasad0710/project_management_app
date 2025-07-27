import "./App.css";

import Navbar from "@components/Navbar";
import { useEffect } from "react";
import { useLazyGetProjectsQuery } from "./store/api";

function App() {
    const [fetchList, { isFetching, data }] = useLazyGetProjectsQuery();

    useEffect(() => {
        fetchList({
            isPaginationEnabled: true,
            page: 1,
            pageSize: 10,
        });
    }, [fetchList]);

    return (
        <div>
            <Navbar />
            <h2 className='text-3xl font-bold'>This World</h2>
            {data?.data?.result?.map((project) => {
                return (
                    <div key={project.id}>
                        <h3>{project.name}</h3>
                    </div>
                );
            })}
        </div>
    );
}

export default App;
