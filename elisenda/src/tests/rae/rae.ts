import Rae from 'rae';

test('adds 1 + 2 to equal 3', async (): Promise<void> => {
  const raeClient = Rae.create();
  const res = await raeClient.search('cassas');
  console.log(res);
});

