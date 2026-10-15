

import { useState } from "react";
import { Box } from "@chakra-ui/react";
import { NhaPhatHanhList } from "./components/NhaPhatHanhList";
import { NhaPhatHanhForm } from "./components/NhaPhatHanhForm";
import { NhaPhatHanhDetail } from "./components/NhaPhatHanhDetail";
import { useNhaPhatHanh } from "./hooks/useNhaPhatHanh";

export default function QuanLyNhaPhatHanh() {
  const [view, setView] = useState("list");
  const [selected, setSelected] = useState(null);
  
  const {
    distributors,
    movies,
    loading,
    search,
    setSearch,
    filterStatus,
    setFilterStatus,
    filterRegion,
    setFilterRegion,
    counts,
    totalMovies,
    toggleStatus,
    deleteDistributor,
    createDistributor,
    updateDistributor,
  } = useNhaPhatHanh();

  const handleSave = async (formData) => {
    let success = false;
    if (view === "add") {
      success = await createDistributor(formData);
    } else {
      const id = selected.DistributorId || selected.id;
      success = await updateDistributor(id, formData);
    }
    if (success) {
      setView("list");
    }
  };

  if (view === "list") {
    return (
      <Box pt={{ base: "100px", md: "80px" }}>
        <NhaPhatHanhList
          distributors={distributors}
          loading={loading}
          search={search}
          setSearch={setSearch}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          filterRegion={filterRegion}
          setFilterRegion={setFilterRegion}
          counts={counts}
          totalMovies={totalMovies}
          onAdd={() => setView("add")}
          onView={(d) => { setSelected(d); setView("detail"); }}
          onEdit={(d) => { setSelected(d); setView("edit"); }}
          onDelete={deleteDistributor}
        />
      </Box>
    );
  }

  if (view === "detail" && selected) {
    const distributor = distributors.find((d) => (d.DistributorId || d.id) === (selected.DistributorId || selected.id)) || selected;
    return (
      <Box pt={{ base: "100px", md: "80px" }}>
        <NhaPhatHanhDetail
          distributor={distributor}
          movies={movies}
          onBack={() => setView("list")}
          onEdit={() => setView("edit")}
          onDelete={() => {
            deleteDistributor(distributor.DistributorId || distributor.id);
            setView("list");
          }}
        />
      </Box>
    );
  }

  if (view === "add") {
    return (
      <Box pt={{ base: "100px", md: "80px" }}>
        <NhaPhatHanhForm
          isAdd
          movies={movies}
          onCancel={() => setView("list")}
          onSave={handleSave}
        />
      </Box>
    );
  }

  if (view === "edit" && selected) {
    const distributor = distributors.find((d) => (d.DistributorId || d.id) === (selected.DistributorId || selected.id)) || selected;
    return (
      <Box pt={{ base: "100px", md: "80px" }}>
        <NhaPhatHanhForm
          distributor={distributor}
          movies={movies}
          onCancel={() => setView("detail")}
          onSave={handleSave}
        />
      </Box>
    );
  }

  return null;
}