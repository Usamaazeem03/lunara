function MainNav() {
  return (
    <div className="mt-8 flex flex-1 flex-col">
      <p className="text-ink-muted text-xs tracking-widest uppercase">menu</p>
      <nav className="mt-3 flex-1 space-y-1 overflow-y-auto">
        <ul class="flex flex-col gap-0.5">
          <li>
            <a
              href="#dashboard"
              class="bg-ink text-cream-soft flex items-center gap-2.5 rounded-[9px] px-2.5 py-2 text-sm font-medium"
            >
              <span class="flex h-[18px] w-[18px] shrink-0 items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.7"
                >
                  <rect x="3" y="3" width="7" height="7" rx="1.5" />
                  <rect x="14" y="3" width="7" height="7" rx="1.5" />
                  <rect x="3" y="14" width="7" height="7" rx="1.5" />
                  <rect x="14" y="14" width="7" height="7" rx="1.5" />
                </svg>
              </span>
              <span class="flex-1 truncate">Dashboard</span>
            </a>
          </li>

          <li>
            <a
              href="#orders"
              class="hover:bg-cream-lite-soft flex items-center gap-2.5 rounded-[9px] px-2.5 py-2 text-sm font-medium text-stone-500 transition-colors hover:text-stone-900"
            >
              <span class="flex h-[18px] w-[18px] shrink-0 items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.7"
                >
                  <path d="M20.5 8.5 12 3 3.5 8.5" />
                  <path d="M3.5 8.5v9L12 21l8.5-3.5v-9" />
                  <path d="M12 12v9" />
                  <path d="M3.5 8.5 12 12l8.5-3.5" />
                </svg>
              </span>
              <span class="flex-1 truncate">Orders</span>
              <span class="min-w-[16px] rounded-full bg-emerald-600 px-1.5 py-0.5 text-center text-[11px] leading-none font-semibold text-white">
                8
              </span>
            </a>
          </li>

          <li>
            <a
              href="#promotions"
              class="flex items-center gap-2.5 rounded-[9px] px-2.5 py-2 text-sm font-medium text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-900"
            >
              <span class="flex h-[18px] w-[18px] shrink-0 items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.7"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="M9 9h.01M15 15h.01" />
                  <path d="M9 15 15 9" />
                </svg>
              </span>
              <span class="flex-1 truncate">Promotions</span>
            </a>
          </li>

          <li>
            <a
              href="#stores"
              class="flex items-center gap-2.5 rounded-[9px] px-2.5 py-2 text-sm font-medium text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-900"
            >
              <span class="flex h-[18px] w-[18px] shrink-0 items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.7"
                >
                  <path d="M4 9h16v11H4z" />
                  <path d="M4 9 5.5 4h13L20 9" />
                  <path d="M9 20v-6h6v6" />
                </svg>
              </span>
              <span class="flex-1 truncate">Stores</span>
            </a>
          </li>

          <li>
            <a
              href="#inventory"
              class="flex items-center gap-2.5 rounded-[9px] px-2.5 py-2 text-sm font-medium text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-900"
            >
              <span class="flex h-[18px] w-[18px] shrink-0 items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.7"
                >
                  <rect x="4" y="4" width="7" height="7" rx="1" />
                  <rect x="13" y="4" width="7" height="7" rx="1" />
                  <rect x="4" y="13" width="7" height="7" rx="1" />
                  <rect x="13" y="13" width="7" height="7" rx="1" />
                </svg>
              </span>
              <span class="flex-1 truncate">Inventory</span>
            </a>
          </li>

          <li>
            <a
              href="#supplier-contracts"
              class="flex items-center gap-2.5 rounded-[9px] px-2.5 py-2 text-sm font-medium text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-900"
            >
              <span class="flex h-[18px] w-[18px] shrink-0 items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.7"
                >
                  <path d="M7 3h8l4 4v14H7z" />
                  <path d="M15 3v4h4" />
                  <path d="M9.5 13h5M9.5 16.5h5" />
                </svg>
              </span>
              <span class="flex-1 truncate">Supplier contracts</span>
            </a>
          </li>

          <li id="analytics-item">
            <a
              href="#analytics"
              onclick="toggleAnalytics(event)"
              class="flex items-center gap-2.5 rounded-[9px] px-2.5 py-2 text-sm font-medium text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-900"
            >
              <span class="flex h-[18px] w-[18px] shrink-0 items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.7"
                >
                  <path d="M12 3a9 9 0 1 0 9 9h-9z" />
                  <path d="M15 3.5A9 9 0 0 1 20.5 9H15z" />
                </svg>
              </span>
              <span class="flex-1 truncate">Analytics</span>
              <span
                id="analytics-chevron"
                class="h-3.5 w-3.5 shrink-0 rotate-90 text-stone-400 transition-transform duration-150"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.7"
                >
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </a>
            <div
              id="analytics-submenu"
              class="max-h-52 overflow-hidden transition-[max-height] duration-200 ease-out"
            >
              <ul class="flex flex-col gap-px py-0.5">
                <li>
                  <a
                    href="#revenues"
                    class="flex items-center gap-2.5 rounded-[9px] py-2 pl-9 text-[13.5px] font-medium text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-900"
                  >
                    <span class="flex h-[18px] w-[18px] shrink-0 items-center justify-center">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.7"
                      >
                        <path d="M4 20V10M10 20V4M16 20v-7M22 20v-3" />
                      </svg>
                    </span>
                    <span class="flex-1 truncate">Revenues</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#expenses"
                    class="flex items-center gap-2.5 rounded-[9px] py-2 pl-9 text-[13.5px] font-medium text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-900"
                  >
                    <span class="flex h-[18px] w-[18px] shrink-0 items-center justify-center">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.7"
                      >
                        <path d="M4 20V14M10 20V6M16 20v-9M22 20v-4" />
                      </svg>
                    </span>
                    <span class="flex-1 truncate">Expenses</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#net-profits"
                    class="flex items-center gap-2.5 rounded-[9px] py-2 pl-9 text-[13.5px] font-medium text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-900"
                  >
                    <span class="flex h-[18px] w-[18px] shrink-0 items-center justify-center">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.7"
                      >
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 7v10M8 12h8" />
                      </svg>
                    </span>
                    <span class="flex-1 truncate">Net profits</span>
                  </a>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </nav>
      ;
    </div>
  );
}

export default MainNav;
