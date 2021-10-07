const selectQuota = {
  filter(betQuota: any) {
    const quota: any = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const rest = [];

    for (let i = 0; i <= betQuota.length; i += 1) {
      const index = quota.indexOf(betQuota[i]?.quota);

      if (index > -1) {
        quota.splice(index, 1);
      }
    }

    for (let i = 0; i < quota.length; i += 1) {
      rest.push({
        index: quota[i],
      });
    }

    return rest;
  },
  filterUpdate(betQuota: any, punterQuota: any) {
    const quota: any = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const rest = [];

    for (let i = 0; i <= betQuota.length; i += 1) {
      const index = quota.indexOf(betQuota[i]?.quota);

      if (betQuota[i]?.quota !== punterQuota) {
        if (index > -1) {
          quota.splice(index, 1);
        }
      }
    }

    for (let i = 0; i < quota.length; i += 1) {
      rest.push({
        index: quota[i],
      });
    }

    return rest;
  },
};

export default selectQuota;
