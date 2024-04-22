import merkleService from '../../services/merkleService';
import authService from '../../services/authService';
import CONFIG from '../../config';

const { ADMIN_ADDRESS } = CONFIG;

const getWhiteLists = async (req, res) => {
  const result = await merkleService.getWhiteLists();
  return res.json(result);
}

const addWhiteList = async (req, res) => {
  const { newAddress, signature } = req.body;
  const isAdmin = authService.verify(ADMIN_ADDRESS, signature);
  if (!isAdmin) {
    return res.status(400).json({msg: "You are not Admin"});
  }
  const result = await merkleService.addWhiteList(newAddress);
  return res.json(result);
}

export default {
  getWhiteLists,
  addWhiteList
}