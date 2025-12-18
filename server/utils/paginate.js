export const paginate = async (Model, query, options) => {
  const page = parseInt(options.page, 10) || 1;
  const limit = parseInt(options.limit, 10) || 12;
  const skip = (page - 1) * limit;

  const sort = options.sort || { createdAt: -1 };
  const select = options.select || "";
  const populate = options.populate || null;

  let mongoQuery = Model.find(query)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .select(select);

  if (populate) {
    mongoQuery = mongoQuery.populate(populate);
  }

  const [result, totalCount] = await Promise.all([
    mongoQuery,
    Model.countDocuments(query),
  ]);

  return {
    result,
    pagination: {
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
      hasNextPage: page * limit < totalCount,
      hasPrevPage: page > 1,
    },
  };
};
