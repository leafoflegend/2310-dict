import express from 'express';
import { faker } from '@faker-js/faker';

const app = express();

const delay = (time) => {
    return new Promise((res) => {
        setTimeout(() => res(), time);
    });
};

const createFakeUser = () => ({
    userId: faker.string.uuid(),
    username: faker.internet.userName(),
    email: faker.internet.email(),
    avatar: faker.image.avatar(),
    password: faker.internet.password(),
    birthdate: faker.date.birthdate(),
    registeredAt: faker.date.past(),
});

const getUserFromDatabase = async () => {
    await delay(1000);

    return createFakeUser();
};

const userCache = {};

app.get('/users/:id', async (req, res) => {
    const { id } = req.params;

    console.time('Get User');
    if (userCache[id]) {
        res.send({ user: userCache[id] });
        console.timeEnd('Get User');
        return;
    }

    const user = await getUserFromDatabase();

    userCache[id] = user;

    res.send({ user });
    console.timeEnd('Get User');
});

app.listen(3000, () => {
   console.log('Server now listening!');
});
