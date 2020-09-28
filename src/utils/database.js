import lowdb from 'lowdb';
import lowdbAdapterLocalStorage from 'lowdb/adapters/LocalStorage';

const adapter = new lowdbAdapterLocalStorage('UserData::Main');
const db = lowdb(adapter);

db.defaults({
	problem: [],
}).write();

db._.mixin({
	updateProblem(array, problem, status) {
		for (let i = 0; i < array.length; i++) {
			if (array[i].problem.oj === problem.oj && array[i].problem.id === problem.id) {
				array[i].status = {
					...array[i].status,
					...status
				};
				return;
			}
		}
		array.push({
			problem: {
				oj: problem.oj,
				id: problem.id,
			},
			status
		});
	},
	queryProblem(array, problem) {
		for (let i = 0; i < array.length; i++) {
			if (array[i].problem.oj === problem.oj && array[i].problem.id === problem.id) {
				return array[i].status;
			}
		}
		return {};
	},
	filterProblem(array, statusType) {
		let list = [];
		for (let i = 0; i < array.length; i++) {
			if (array[i].status && array[i].status[statusType]) {
				list.push(array[i].problem);
			}
		}
		return list;
	}
});

export default db;