import type { FeatureInfo, InternalCompanyInfo } from "@/types/config.types";
import { Outlet, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { useAppSelector } from "@/store/reduxHook";

type Params = {
    "feature-slug": string;
};

const FeatureLayout = () => {
    const [internalCompanyInfo, setInternalCompanyInfo] = useState<
        InternalCompanyInfo | undefined
    >();

    const [selectedFeature, setSelectedFeature] = useState<FeatureInfo>();
    const { ["feature-slug"]: featureSlug } = useParams<Params>();
    const authenticateEmployee = useAppSelector(
        (state) => state.global.authenticateEmployee
    );

    useEffect(() => {
        if (authenticateEmployee?.companyInfo[0]) {
            setInternalCompanyInfo(authenticateEmployee?.companyInfo[0]);
            setSelectedFeature(
                authenticateEmployee?.companyInfo[0]?.feature?.find(
                    (feature) => feature.features_slug === featureSlug
                )
            );
        }
    }, [authenticateEmployee, featureSlug]);

    return (
        <div className='mx-auto max-w-(--breakpoint-2xl) p-4 md:p-6'>
            <Outlet
                context={{
                    internalCompanyInfo,
                    selectedFeature,
                    userId: authenticateEmployee?.id,
                }}
            />
        </div>
    );
};

export default FeatureLayout;
