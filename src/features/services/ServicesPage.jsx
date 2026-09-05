import { useState } from "react";
import AppHeader from "../../AppLayout/AppHeader.jsx";
import Button from "../../Shared/Button.jsx";
import { ServiceCard } from "./ServiceCard.jsx";
import ServiceFilter from "./ServiceFilter.jsx";
import CreateServiceForm from "./CreateServiceForm.jsx";
import BottomActionBar from "./BottomActionBar.jsx";
import { ServicesStats } from "./servicesStats.jsx";
import { useServicesPage } from "./useServicesPage.js";

const SERVICES_PER_PAGE = 6;
const SERVICES_PAGE_STORAGE_KEY = "lunara-services-page";

const getSavedServicesPage = () => {
  const savedPage = Number(sessionStorage.getItem(SERVICES_PAGE_STORAGE_KEY));
  return Number.isInteger(savedPage) && savedPage > 0 ? savedPage : 1;
};

const ServicesPage = () => {
  const {
    categories,
    selectedCategory,
    setActiveCategory,
    filteredServices,
    isLoading,
    loadError,
    showForm,
    formState,
    saveError,
    saveSuccess,
    actionError,
    actionSuccess,
    isDeleting,
    deletingServiceId,
    openCreateForm,
    closeForm,
    editService,
    deleteService,
  } = useServicesPage();
  const [currentPage, setCurrentPage] = useState(getSavedServicesPage);
  const totalPages = Math.ceil(filteredServices.length / SERVICES_PER_PAGE);
  const visibleServices = filteredServices.slice(
    (currentPage - 1) * SERVICES_PER_PAGE,
    currentPage * SERVICES_PER_PAGE,
  );

  const handleCategoryChange = (category) => {
    setCurrentPage(1);
    sessionStorage.setItem(SERVICES_PAGE_STORAGE_KEY, "1");
    setActiveCategory(category);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    sessionStorage.setItem(SERVICES_PAGE_STORAGE_KEY, String(page));
  };

  return (
    <section className="flex h-full flex-col">
      <AppHeader
        eyebrow="Services"
        title="Services"
        description="Manage your salon services and pricing."
      >
        <Button
          variant="primary"
          onClick={showForm ? closeForm : openCreateForm}
        >
          {showForm ? "Close" : "Add Service"}
        </Button>
      </AppHeader>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={closeForm}
          />

          <CreateServiceForm
            formState={formState}
            saveError={saveError}
            saveSuccess={saveSuccess}
            onCloseForm={closeForm}
          />
        </div>
      )}

      <ServicesStats />

      <div className="mt-5 flex flex-col gap-4">
        <ServiceFilter
          categories={categories}
          selectedCategory={selectedCategory}
          setActiveCategory={handleCategoryChange}
        />

        {loadError && (
          <div className="border-2 border-[#b0412e]/40 bg-[#b0412e]/10 p-3 text-sm text-[#b0412e]">
            {loadError}
          </div>
        )}

        {actionError && (
          <div className="border-2 border-[#b0412e]/40 bg-[#b0412e]/10 p-3 text-sm text-[#b0412e]">
            {actionError}
          </div>
        )}

        {actionSuccess && (
          <div className="border-ink/20 bg-cream text-ink border-2 p-3 text-sm">
            {actionSuccess}
          </div>
        )}

        {isLoading && (
          <div className="border-ink/20 text-ink-muted border-2 bg-white/90 p-4 text-sm">
            Loading services...
          </div>
        )}

        {!isLoading && filteredServices.length === 0 && (
          <div className="border-ink/30 bg-cream text-ink-muted border-2 border-dashed p-4 text-center text-sm">
            No services available yet. Add your first service above.
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visibleServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onEdit={editService}
              onDelete={deleteService}
              isDeleting={isDeleting && deletingServiceId === service.id}
            />
          ))}
        </div>

        <BottomActionBar
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </section>
  );
};

export default ServicesPage;
