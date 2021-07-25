export const signup = (user) => {
	return $.ajax({
		url: `/api/users`,
		method: 'POST',
		data: { user },
	});
};

export const login = (user) => {
	return $.ajax({
		url: `/api/session`,
		method: 'POST',
		data: { user },
	});
};

export const logout = () => {
	return $.ajax({
		url: `/api/session`,
		method: 'DELETE',
	});
};

export const logindemo = () => {
	return $.ajax({
		method: 'POST',
		url: `/api/session`,
		data: {
			user: {
				email: 'demo@user.com',
				password: 'demouser987654321',
			},
		},
	});
};

export const updateUser = (user) => {
	return $.ajax({
		url: `/api/users/${user.id}`,
		method: 'PATCH',
		data: { user },
	});
};

export const deleteUser = (userId) => {
	return $.ajax({
		url: `/api/users/${userId}`,
		method: 'DELETE',
	});
};
