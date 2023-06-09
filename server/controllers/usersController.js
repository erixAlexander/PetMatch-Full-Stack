const { MongoClient } = require("mongodb");
const URI = process.env.URI;

const handleUsers = async (req, res) => {
  const client = new MongoClient(URI);
  const userIds = JSON.parse(req.query.userIds);

  try {
    await client.connect();
    const database = client.db("app-data");
    const users = database.collection("users");
    const pipeline = [
      {
        $match: {
          user_id: {
            $in: userIds,
          },
        },
      },
      {
        $project: {
          user_id: 1,
          pet_name: 1,
          images: 1,
          user_matches: 1,
        },
      },
    ];
    const returnedUsers = await users.aggregate(pipeline).toArray();
    res.send(returnedUsers);
  } finally {
    await client.close();
  }
};

module.exports = { handleUsers };
