// hooks/useContact.js
import { useState, useCallback, useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import ContactApi from "../../../../api/ContactApi";

export function useContact() {
  const toast = useToast();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);
  const [view, setView] = useState("list");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("Tất cả");
  const [submitting, setSubmitting] = useState(false);

  // Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      });
    } catch {
      return dateStr;
    }
  };

  // Load contacts from API
  const loadContacts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await ContactApi.getAll();
      const data = res.data?.data ?? res.data ?? [];
      setContacts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Lỗi load liên hệ:", err);
      toast({
        title: "Lỗi khi tải danh sách liên hệ",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Load on mount
  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  // Get statistics
  const getStats = useCallback(() => {
    const total = contacts.length;
    const pending = contacts.filter(c => (c.Status || c.status) === "Chưa xử lý").length;
    const processing = contacts.filter(c => (c.Status || c.status) === "Đang xử lý").length;
    const done = contacts.filter(c => (c.Status || c.status) === "Đã xử lý").length;
    return { total, pending, processing, done };
  }, [contacts]);

  // Get filtered contacts
  const getFilteredContacts = useCallback(() => {
    return contacts.filter(c => {
      const name = (c.FullName || c.fullname || c.Name || c.name || "").toLowerCase();
      const email = (c.Email || c.email || "").toLowerCase();
      const subject = (c.Subject || c.subject || "").toLowerCase();
      const status = c.Status || c.status || "";
      const q = search.toLowerCase();

      const matchSearch = !q || name.includes(q) || email.includes(q) || subject.includes(q);
      const matchStatus = filterStatus === "Tất cả" || status === filterStatus;

      return matchSearch && matchStatus;
    });
  }, [contacts, search, filterStatus]);

  // View detail
  const viewDetail = useCallback((contact) => {
    setSelectedContact(contact);
    setView("detail");
  }, []);

  // View process
  const viewProcess = useCallback((contact) => {
    setSelectedContact(contact);
    setView("process");
  }, []);

  // Go back
  const goBack = useCallback(() => {
    setView("list");
    setSelectedContact(null);
  }, []);

  // Update contact
  const handleUpdate = useCallback(async (contactId, data) => {
    try {
      setSubmitting(true);
      
      // Lấy contact hiện tại để có đầy đủ thông tin
      const currentContact = contacts.find(c => (c.ContactId ?? c.id) === contactId);
      if (!currentContact) {
        throw new Error("Không tìm thấy liên hệ");
      }

      // Chuẩn bị payload với đầy đủ thông tin
      const payload = {
        FullName: currentContact.FullName || currentContact.fullname || currentContact.Name || currentContact.name,
        Email: currentContact.Email || currentContact.email,
        Phone: currentContact.Phone || currentContact.phone,
        Subject: currentContact.Subject || currentContact.subject,
        Message: currentContact.Message || currentContact.message,
        Status: data.Status || currentContact.Status || currentContact.status || "Chưa xử lý",
        Reply: data.Reply || "",
      };

      // Nếu có Reply thì thêm vào
      if (data.Reply) {
        payload.Reply = data.Reply;
      }

      await ContactApi.update(contactId, payload);
      
      // Cập nhật local state
      setContacts(prev =>
        prev.map(c => {
          const cId = c.ContactId ?? c.id;
          return cId === contactId ? { ...c, ...payload, Status: payload.Status, status: payload.Status } : c;
        })
      );

      // Cập nhật selectedContact nếu đang xem
      if (selectedContact && (selectedContact.ContactId ?? selectedContact.id) === contactId) {
        setSelectedContact(prev => ({ ...prev, ...payload, Status: payload.Status }));
      }

      toast({
        title: "✅ Cập nhật thành công!",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });

      return true;
    } catch (err) {
      console.error("Lỗi cập nhật:", err);
      toast({
        title: "❌ Cập nhật thất bại!",
        description: err.response?.data?.message || err.message || "Vui lòng thử lại",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return false;
    } finally {
      setSubmitting(false);
    }
  }, [contacts, selectedContact, toast]);

  // Delete contact
  const handleDelete = useCallback(async (contactId) => {
    try {
      await ContactApi.delete(contactId);
      setContacts(prev => prev.filter(c => (c.ContactId ?? c.id) !== contactId));

      toast({
        title: "🗑️ Đã xóa liên hệ!",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });

      if (selectedContact && (selectedContact.ContactId ?? selectedContact.id) === contactId) {
        setSelectedContact(null);
        setView("list");
      }
      return true;
    } catch (err) {
      console.error("Lỗi xóa:", err);
      toast({
        title: "❌ Xóa thất bại!",
        description: err.response?.data?.message || "Vui lòng thử lại",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
  }, [toast, selectedContact]);

  return {
    contacts,
    loading,
    selectedContact,
    view,
    search,
    setSearch,
    filterStatus,
    setFilterStatus,
    submitting,
    loadContacts,
    getStats,
    getFilteredContacts,
    viewDetail,
    viewProcess,
    handleUpdate,
    handleDelete,
    goBack,
    setView,
    formatDate,
  };
}