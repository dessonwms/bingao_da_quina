const selectQuota = {
  filter(betQuota: any) {
    const quota: any = [];

    for (let i = 1; i <= 10; i += 1) {
      if (betQuota[i - 1]?.quota !== i) {
        quota.push({
          number_hits: i,
        });
      }
    }

    return quota;
  },
};

export default selectQuota;
