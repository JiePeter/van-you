import { localizedValue, type LocalizedStr } from "@/lib/sanity/localizedValue";
import { fetchSanityData } from "@/lib/sanity/fetch";
import { siteSettingsQuery } from "@/lib/sanity/queries";

interface SiteSettingsData {
  contact?: {
    phone?: string;
    email?: string;
    addressText?: LocalizedStr;
    addressMapUrl?: string;
  };
  serviceAreas?: Array<LocalizedStr>;
}

interface ContactInfoBlockProps {
  data: Record<string, unknown>;
  locale: string;
}

/* SVG 图标组件 */
function PhoneIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  );
}

export default async function ContactInfoBlock({ data, locale }: ContactInfoBlockProps) {
  const settings = await fetchSanityData<SiteSettingsData>(siteSettingsQuery, "siteSettings");
  const contact = settings.contact;

  const anchorId = data.anchorId as string | undefined;
  const title = localizedValue(data.title as LocalizedStr, locale);
  const phoneLabel = localizedValue(data.phoneLabel as LocalizedStr, locale);
  const emailLabel = localizedValue(data.emailLabel as LocalizedStr, locale);
  const addressLabel = localizedValue(data.addressLabel as LocalizedStr, locale);
  const showServiceAreas = data.showServiceAreas as boolean | undefined;

  const phone = contact?.phone;
  const email = contact?.email;
  const address = localizedValue(contact?.addressText, locale);
  const mapUrl = contact?.addressMapUrl;
  const serviceAreas = settings.serviceAreas ?? [];

  return (
    <section id={anchorId} className="py-16 md:py-24 bg-base-200/50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="card bg-base-100 shadow-lg max-w-xl">
          <div className="card-body">
            {title && (
              <h2 className="card-title text-3xl md:text-4xl font-bold mb-8">
                {title}
              </h2>
            )}

            <div className="space-y-0">
              {/* 电话 */}
              {phone && phoneLabel && (
                <div className="flex items-start gap-4 py-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <PhoneIcon />
                  </div>
                  <div>
                    <p className="text-sm font-medium opacity-50">{phoneLabel}</p>
                    <a href={`tel:${phone}`} className="link link-hover font-medium">
                      {phone}
                    </a>
                  </div>
                </div>
              )}

              {phone && email && <div className="divider my-0" />}

              {/* 邮箱 */}
              {email && emailLabel && (
                <div className="flex items-start gap-4 py-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <EmailIcon />
                  </div>
                  <div>
                    <p className="text-sm font-medium opacity-50">{emailLabel}</p>
                    <a href={`mailto:${email}`} className="link link-hover font-medium">
                      {email}
                    </a>
                  </div>
                </div>
              )}

              {email && address && <div className="divider my-0" />}

              {/* 地址 */}
              {address && addressLabel && (
                <div className="flex items-start gap-4 py-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <MapPinIcon />
                  </div>
                  <div>
                    <p className="text-sm font-medium opacity-50">{addressLabel}</p>
                    {mapUrl ? (
                      <a
                        href={mapUrl}
                        className="link link-hover font-medium"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {address}
                      </a>
                    ) : (
                      <p className="font-medium">{address}</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 服务区域标签 */}
            {showServiceAreas && serviceAreas.length > 0 && (
              <div className="mt-6 pt-5 border-t border-base-300">
                <p className="text-sm font-medium opacity-50 mb-3">Service Areas</p>
                <div className="flex flex-wrap gap-2">
                  {serviceAreas.map((area, idx) => (
                    <span key={idx} className="badge badge-outline badge-sm gap-1">
                      <MapPinIcon />
                      {localizedValue(area, locale)}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
