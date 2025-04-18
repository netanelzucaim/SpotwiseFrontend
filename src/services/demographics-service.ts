import axios from "axios";

const DemographicService = {
    async getCensusDemographics(zip: string): Promise<{ population?: string; income?: string }> {
        try {
            const response = await axios.get("https://api.census.gov/data/2019/acs/acs5", {
                params: {
                    get: "B01003_001E,B19013_001E",
                    for: `zip code tabulation area:${zip}`,
                },
            });

            const data = response.data;
            if (data && data.length > 1) {
                const [population, income] = data[1];
                return { population, income };
            }
        } catch (error) {
            console.warn("Census data not available:", error.message);
        }

        return {};
    }
};

export default DemographicService;