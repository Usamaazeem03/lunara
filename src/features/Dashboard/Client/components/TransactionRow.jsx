const TransactionRow = ({ transaction }) => {
  return (
    <div className="grid gap-3 px-4 py-2.5 text-sm transition hover:bg-[#f3efe9]/60 sm:grid-cols-[1fr_1.4fr_1fr_0.8fr_0.7fr_0.7fr_0.9fr] sm:items-center">
      <p className="text-xs tracking-widest text-[#5f544b] uppercase sm:hidden">
        Date
      </p>
      <p>{transaction.date}</p>

      <p className="text-xs tracking-widest text-[#5f544b] uppercase sm:hidden">
        Service
      </p>
      <p className="font-semibold">{transaction.service}</p>

      <p className="text-xs tracking-widest text-[#5f544b] uppercase sm:hidden">
        Staff
      </p>
      <p>{transaction.staff}</p>

      <p className="text-xs tracking-widest text-[#5f544b] uppercase sm:hidden">
        Amount
      </p>
      <p>{transaction.amount}</p>

      <p className="text-xs tracking-widest text-[#5f544b] uppercase sm:hidden">
        Method
      </p>
      <p>{transaction.method}</p>

      <p className="text-xs tracking-widest text-[#5f544b] uppercase sm:hidden">
        Status
      </p>
      <span className="w-fit rounded-full border-2 border-[#2d2620]/30 bg-[#f3efe9] px-3 py-1 text-[0.65rem] tracking-widest text-[#2d2620] uppercase">
        {transaction.status}
      </span>

      <p className="text-xs tracking-widest text-[#5f544b] uppercase sm:hidden">
        Actions
      </p>
      <button className="w-fit border-2 border-[#2d2620] px-3 py-1 text-xs tracking-widest uppercase transition hover:bg-[#2d2620] hover:text-[#f3efe9]">
        Invoice
      </button>
    </div>
  );
};

export default TransactionRow;
