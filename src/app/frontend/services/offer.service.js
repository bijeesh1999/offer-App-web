import axios from "axios";
axios.defaults.withCredentials = true;

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/offers`;

// Create Offer
export const createOffer = async (body) => {
  console.log({ body });

  try {
    const res = await axios.post(`${API_BASE_URL}`, body, {
      withCredentials: true,
    });
    return res;
  } catch (error) {
    return error;
  }
};

// List Expenses
export const findAllOffers = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}`, { withCredentials: true });
    console.log({res});
    
    return res;
  } catch (error) {
    return error;
  }
};

// Update Expense
export const updateOffer = async ({ id, body }) => {
  try {
    const res = await axios.put(`${API_BASE_URL}/update/${id}`, body, {
      withCredentials: true,
    });
    return res;
  } catch (error) {
    return error;
  }
};

// Delete Expense (Soft Delete)
export const deleteOffer = async (id) => {
  try {
    const res = await axios.put(
      `${API_BASE_URL}/delete/${id}`,
      { isDeleted: true },
      { withCredentials: true }
    );
    return res;
  } catch (error) {
    return error;
  }
};
