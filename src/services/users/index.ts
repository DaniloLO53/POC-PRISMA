import usersRepository from "@/repositories/users";

export async function getAllUsers() {
  const users = await usersRepository.findAll();

  return users;
}

const usersService = {
  getAllUsers,
};

export default usersService;
