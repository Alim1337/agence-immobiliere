export default function MentionsLegalesPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-14">
      <h1 className="font-display text-3xl text-ink">Mentions légales</h1>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-ink-60">
        <section>
          <h2 className="font-display text-lg text-ink">Éditeur du site</h2>
          <p className="mt-2">
            Maison &amp; Fils — SARL au capital de 1 000 000 DA
            <br />
            Cité des Annassers, 16035 Alger
            <br />
            Registre du commerce n° 16/00-0000000 A 24 — NIF 000000000000000
            <br />
            Tél. 021 60 00 00 — contact@maisonetfils.fr
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg text-ink">Hébergement</h2>
          <p className="mt-2">
            [Nom de l&apos;hébergeur], [adresse de l&apos;hébergeur]
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg text-ink">
            Protection des données personnelles
          </h2>
          <p className="mt-2">
            Les informations recueillies via les formulaires de ce site
            (contact, estimation) sont destinées exclusivement à Maison &amp;
            Fils, dans le cadre du traitement de votre demande.
            Conformément à la réglementation applicable en matière de
            protection des données personnelles, vous disposez d&apos;un
            droit d&apos;accès, de rectification et de suppression de vos
            données, exerçable par email à contact@maisonetfils.fr.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg text-ink">Cookies</h2>
          <p className="mt-2">
            Ce site n&apos;utilise pas de cookies de suivi publicitaire.
            [Compléter selon les outils de mesure d&apos;audience réellement
            utilisés.]
          </p>
        </section>
      </div>

      <p className="mt-10 rounded-sm border border-dashed border-stone-line p-4 text-xs text-ink-60">
        Contenu à faire relire par un professionnel du droit avant mise en
        ligne : les mentions ci-dessus sont un point de départ, pas un texte
        juridique validé.
      </p>
    </div>
  );
}
