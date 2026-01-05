import { getTryoutList } from "../services/tryout.service.js";

export const getTryoutData = async (req, res) => {
    const data = await getTryoutList();
    res.json({tryout:data})
}