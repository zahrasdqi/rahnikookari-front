import apiClient from "../api/apiClient";
import { ENDPOINTS } from "../api/endpoints";
import { mediaService } from "./media.service";

export const charityVerificationService = {
  async create(formData) {
    const uploadItems = [
      {
        key: "articles_of_association",
        label: "اساسنامه",
        file: formData.statute_file,
        promise: mediaService.upload(
          formData.statute_file,
          "articles_of_association"
        ),
      },
      {
        key: "activity_license",
        label: "مجوز فعالیت",
        file: formData.activity_license_file,
        promise: mediaService.upload(
          formData.activity_license_file,
          "activity_license"
        ),
      },
      {
        key: "national_card",
        label: "کارت ملی",
        file: formData.national_card_file,
        promise: mediaService.upload(
          formData.national_card_file,
          "national_card"
        ),
      },
    ];

    const uploadResults = await Promise.allSettled(
      uploadItems.map((item) => item.promise)
    );

    console.table(
      uploadResults.map((result, index) => {
        const item = uploadItems[index];

        return {
          key: item.key,
          label: item.label,
          fileName: item.file?.name,
          result: result.status,
          httpStatus:
            result.status === "rejected"
              ? result.reason?.response?.status
              : 200,
          backendResponse:
            result.status === "rejected"
              ? JSON.stringify(result.reason?.response?.data || null)
              : "OK",
          errorMessage:
            result.status === "rejected"
              ? result.reason?.message
              : "",
        };
      })
    );

    const failedUploads = uploadResults
      .map((result, index) => ({
        result,
        item: uploadItems[index],
      }))
      .filter(({ result }) => result.status === "rejected");

    if (failedUploads.length > 0) {
      const errorDetails = failedUploads.map(({ result, item }) => ({
        key: item.key,
        label: item.label,
        fileName: item.file?.name,
        httpStatus: result.reason?.response?.status,
        response: result.reason?.response?.data,
        message: result.reason?.message,
      }));

      console.error("[charity verification upload failed]", errorDetails);

      throw new Error("آپلود یک یا چند فایل ناموفق بود. لطفاً دوباره تلاش کنید.");
    }

    const [
      articlesOfAssociationUpload,
      activityLicenseUpload,
      nationalCardUpload,
    ] = uploadResults.map((result) => result.value);

    const payload = {
      charity_name: formData.org_name,
      registration_number: formData.registration_number,
      establishment_date: formData.established_date,
      activity_field: formData.activity_field,
      short_description: formData.description,

      phone: formData.phone,
      email: formData.email,
      website: formData.website || null,
      province: formData.province,
      city: formData.city,
      full_address: formData.address,

      bank_name: formData.bank_name,
      shaba_number: formData.sheba,
      account_owner: formData.account_owner,

      articles_of_association_file_id: articlesOfAssociationUpload.id,
      activity_license_file_id: activityLicenseUpload.id,
      national_card_file_id: nationalCardUpload.id,
    };

    const { data } = await apiClient.post(
      ENDPOINTS.charityVerification.create,
      payload
    );

    return data;
  },
};
