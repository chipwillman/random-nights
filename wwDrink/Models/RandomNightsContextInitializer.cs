namespace wwDrink.Models
{
    using System;
    using System.Data.Entity;

    public class RandomNightsContextInitializer : DropCreateDatabaseIfModelChanges<RandomNightsContext>
    {
        protected override void Seed(RandomNightsContext context)
        {
            context.Categories.Add(
                new PreferenceCategory { CategoryName = "Music Genre", PreferenceCategoryPk = new Guid("8AEF2596-203B-4B55-8E6A-C0F9C9363200") });
            context.Aspects.Add(new Aspect { AspectPk = new Guid("61C2D22A-4EC9-4EEB-95E3-FCF98159DE09"), AspectName = "Hip Hop", PreferenceCategoryPk = new Guid("8AEF2596-203B-4B55-8E6A-C0F9C9363200") });
            context.Aspects.Add(new Aspect { AspectPk = new Guid("B8110030-0E64-489E-8D12-6021B9D528CA"), AspectName = "Hard Rock", PreferenceCategoryPk = new Guid("8AEF2596-203B-4B55-8E6A-C0F9C9363200") });
            context.Aspects.Add(new Aspect { AspectPk = new Guid("ACDD14A8-F14D-4AAA-8837-23CEBF1DCAB8"), AspectName = "Metal", PreferenceCategoryPk = new Guid("8AEF2596-203B-4B55-8E6A-C0F9C9363200") });
            context.Aspects.Add(new Aspect { AspectPk = new Guid("CBE5FFE5-9992-4543-AACD-B9484784379A"), AspectName = "Classic Rock", PreferenceCategoryPk = new Guid("8AEF2596-203B-4B55-8E6A-C0F9C9363200") });
            context.Aspects.Add(new Aspect { AspectPk = new Guid("554A9A7A-D71E-4ADF-A86A-771132E4494C"), AspectName = "Country", PreferenceCategoryPk = new Guid("8AEF2596-203B-4B55-8E6A-C0F9C9363200") });
            context.Aspects.Add(new Aspect { AspectPk = new Guid("0599FECA-6DB6-4B2F-B9DF-FAD53E8669BE"), AspectName = "Jazz", PreferenceCategoryPk = new Guid("8AEF2596-203B-4B55-8E6A-C0F9C9363200") });
            context.Aspects.Add(new Aspect { AspectPk = new Guid("E414F63F-809F-453E-8A79-D960AE94CDB7"), AspectName = "Classical", PreferenceCategoryPk = new Guid("8AEF2596-203B-4B55-8E6A-C0F9C9363200") });
            context.Aspects.Add(new Aspect { AspectPk = new Guid("EAAF3033-2AA9-4F10-B7AA-FCC1621F4F38"), AspectName = "Folk", PreferenceCategoryPk = new Guid("8AEF2596-203B-4B55-8E6A-C0F9C9363200") });
            context.Aspects.Add(new Aspect { AspectPk = new Guid("D3A18949-CE38-4AB1-9F02-0C97E64D6C42"), AspectName = "Blues", PreferenceCategoryPk = new Guid("8AEF2596-203B-4B55-8E6A-C0F9C9363200") });
            
            context.Categories.Add(
                new PreferenceCategory { CategoryName = "Sexual Orientation", PreferenceCategoryPk = new Guid("46886817-FC83-4F89-B3B0-D1694064FFCD") });
            context.Aspects.Add(new Aspect { AspectPk = new Guid("D95A06FF-B3AD-4DB9-AF03-F9BEE1CA0CF9"), AspectName = "Straight", PreferenceCategoryPk = new Guid("46886817-FC83-4F89-B3B0-D1694064FFCD") });
            context.Aspects.Add(new Aspect { AspectPk = new Guid("A2FDB9B2-70F0-4673-AC65-9DEBA3A9B817"), AspectName = "Gay", PreferenceCategoryPk = new Guid("46886817-FC83-4F89-B3B0-D1694064FFCD") });
            context.Aspects.Add(new Aspect { AspectPk = new Guid("1F96CE49-8A53-46BC-8733-2BE872164568"), AspectName = "Lesbian", PreferenceCategoryPk = new Guid("46886817-FC83-4F89-B3B0-D1694064FFCD") });

            context.Categories.Add(
                new PreferenceCategory { CategoryName = "Service and Staff", PreferenceCategoryPk = new Guid("9DB6887C-592D-439C-8ABD-23ED8D8B2ECA") });
            context.Aspects.Add(new Aspect { AspectPk = new Guid("179D55B4-D4AD-4FB8-BCC5-A2BF495F0B97"), AspectName = "Bar", PreferenceCategoryPk = new Guid("9DB6887C-592D-439C-8ABD-23ED8D8B2ECA") });
            context.Aspects.Add(new Aspect { AspectPk = new Guid("506AD1CD-4088-4383-8BE2-652D2CCB7963"), AspectName = "Table", PreferenceCategoryPk = new Guid("9DB6887C-592D-439C-8ABD-23ED8D8B2ECA") });
            context.Aspects.Add(new Aspect { AspectPk = new Guid("19762BCB-4CE8-4EB3-BE44-D67AFA5A2863"), AspectName = "Security", PreferenceCategoryPk = new Guid("9DB6887C-592D-439C-8ABD-23ED8D8B2ECA") });
            context.Aspects.Add(new Aspect { AspectPk = new Guid("76C3DA29-266A-49AF-975A-B95C382F8372"), AspectName = "Manager", PreferenceCategoryPk = new Guid("9DB6887C-592D-439C-8ABD-23ED8D8B2ECA") });

            context.Categories.Add(
                new PreferenceCategory { CategoryName = "Venue Type", PreferenceCategoryPk = new Guid("9B109BB0-99DC-4872-BEF9-C67F6C4EA33A") });
            context.Aspects.Add(new Aspect { AspectPk = new Guid("9B544D86-2891-4E54-84EA-C4D670457195"), AspectName = "Sport Bar", PreferenceCategoryPk = new Guid("9B109BB0-99DC-4872-BEF9-C67F6C4EA33A") });
            context.Aspects.Add(new Aspect { AspectPk = new Guid("A9EDACDC-7D7F-4A87-AFC7-F1F167913261"), AspectName = "Irish Pub", PreferenceCategoryPk = new Guid("9B109BB0-99DC-4872-BEF9-C67F6C4EA33A") });
            context.Aspects.Add(new Aspect { AspectPk = new Guid("D485FE5B-ECF4-425F-9818-A71EBDC49E3B"), AspectName = "German Beer", PreferenceCategoryPk = new Guid("9B109BB0-99DC-4872-BEF9-C67F6C4EA33A") });
            context.Aspects.Add(new Aspect { AspectPk = new Guid("3D059C69-CFE1-4186-9693-0272600EF4A7"), AspectName = "Public Bar", PreferenceCategoryPk = new Guid("9B109BB0-99DC-4872-BEF9-C67F6C4EA33A") });
            context.Aspects.Add(new Aspect { AspectPk = new Guid("01C8853F-4AD6-42B7-8507-146F9C3D3CA4"), AspectName = "Night Club", PreferenceCategoryPk = new Guid("9B109BB0-99DC-4872-BEF9-C67F6C4EA33A") });
            context.Aspects.Add(new Aspect { AspectPk = new Guid("4D4E8CA8-7A79-40A4-B492-D69AFE7CF76C"), AspectName = "Piano Bar", PreferenceCategoryPk = new Guid("9B109BB0-99DC-4872-BEF9-C67F6C4EA33A") });
            context.Aspects.Add(new Aspect { AspectPk = new Guid("ACB9E0BC-ACBC-4166-8155-40A32B3E2978"), AspectName = "Jazz Club", PreferenceCategoryPk = new Guid("9B109BB0-99DC-4872-BEF9-C67F6C4EA33A") });
            context.Aspects.Add(new Aspect { AspectPk = new Guid("9072F7BA-C3CA-485A-9FD3-F8B77FFB08F3"), AspectName = "Happy Hour", PreferenceCategoryPk = new Guid("9B109BB0-99DC-4872-BEF9-C67F6C4EA33A") });

            context.Categories.Add(
                new PreferenceCategory { CategoryName = "Group Activities", PreferenceCategoryPk = new Guid("4AAF9665-1EAE-4B68-9404-AF85E43998B2") });
            context.Aspects.Add(new Aspect { AspectPk = new Guid("CF03012F-C547-403D-9967-BD3FC8F0B6EC"), AspectName = "Trivia", PreferenceCategoryPk = new Guid("4AAF9665-1EAE-4B68-9404-AF85E43998B2") });
            context.Aspects.Add(new Aspect { AspectPk = new Guid("E0EE9081-AB34-4E75-984B-DB9CB913D196"), AspectName = "Sports Tipping", PreferenceCategoryPk = new Guid("4AAF9665-1EAE-4B68-9404-AF85E43998B2") });
            context.Aspects.Add(new Aspect { AspectPk = new Guid("721C548A-F87C-41C3-9028-9CF3BEF11D88"), AspectName = "Poker", PreferenceCategoryPk = new Guid("4AAF9665-1EAE-4B68-9404-AF85E43998B2") });
            context.Aspects.Add(new Aspect { AspectPk = new Guid("161BBB17-AB9A-4BA3-B9C0-038D6A1E81D6"), AspectName = "Pokies", PreferenceCategoryPk = new Guid("4AAF9665-1EAE-4B68-9404-AF85E43998B2") });
            context.Aspects.Add(new Aspect { AspectPk = new Guid("1837E72A-C60F-49B1-8FE2-9CC4884E898A"), AspectName = "Karaoke", PreferenceCategoryPk = new Guid("4AAF9665-1EAE-4B68-9404-AF85E43998B2") });
            context.Aspects.Add(new Aspect { AspectPk = new Guid("9E2E27B3-01A3-4772-9A40-ADDCF869ED6F"), AspectName = "Salsa", PreferenceCategoryPk = new Guid("4AAF9665-1EAE-4B68-9404-AF85E43998B2") });
            context.Aspects.Add(new Aspect { AspectPk = new Guid("78286D2D-17E7-4054-A981-08E1BAD0D2E8"), AspectName = "Open Mic", PreferenceCategoryPk = new Guid("4AAF9665-1EAE-4B68-9404-AF85E43998B2") });
            
            context.Categories.Add(
                new PreferenceCategory { CategoryName = "Games", PreferenceCategoryPk = new Guid("044B345D-A6EF-48E4-858B-16059105DA20") });
            context.Aspects.Add(new Aspect { AspectPk = new Guid("C970D287-D31E-4230-A159-63E29D3EE82A"), AspectName = "Pool", PreferenceCategoryPk = new Guid("044B345D-A6EF-48E4-858B-16059105DA20") });
            context.Aspects.Add(new Aspect { AspectPk = new Guid("5D2AD98B-BE7D-4C14-8973-72E949C5CEE3"), AspectName = "Darts", PreferenceCategoryPk = new Guid("044B345D-A6EF-48E4-858B-16059105DA20") });
            context.Aspects.Add(new Aspect { AspectPk = new Guid("04D29BD8-109B-4142-AEFE-ACCBD493930D"), AspectName = "Pinball", PreferenceCategoryPk = new Guid("044B345D-A6EF-48E4-858B-16059105DA20") });
            context.Aspects.Add(new Aspect { AspectPk = new Guid("CFAD1911-7720-41A4-AF59-7AE9F063047A"), AspectName = "Arcade", PreferenceCategoryPk = new Guid("044B345D-A6EF-48E4-858B-16059105DA20") });
            
            context.Categories.Add(
                new PreferenceCategory { CategoryName = "Atmosphere", PreferenceCategoryPk = new Guid("13B3CB56-7E4C-4232-93F8-979602D10924") });
            context.Aspects.Add(new Aspect { AspectPk = new Guid("31568216-186E-43C8-BE8F-06B586C0C275"), AspectName = "Beer Garden", PreferenceCategoryPk = new Guid("13B3CB56-7E4C-4232-93F8-979602D10924") });
            context.Aspects.Add(new Aspect { AspectPk = new Guid("8036A100-9BC7-4B0C-B1E6-CF7D559B819D"), AspectName = "Function Room", PreferenceCategoryPk = new Guid("13B3CB56-7E4C-4232-93F8-979602D10924") });
            context.Aspects.Add(new Aspect { AspectPk = new Guid("407D6D08-887A-43BD-8406-258E40BDEAC6"), AspectName = "Dress Code", PreferenceCategoryPk = new Guid("13B3CB56-7E4C-4232-93F8-979602D10924") });
            context.Aspects.Add(new Aspect { AspectPk = new Guid("AF8193DD-0347-4C2C-BAC6-6CA00FCE2C2E"), AspectName = "Smoking Area", PreferenceCategoryPk = new Guid("13B3CB56-7E4C-4232-93F8-979602D10924") });
            
            context.Categories.Add(
                new PreferenceCategory { CategoryName = "Food", PreferenceCategoryPk = new Guid("5FF1197C-6623-4233-8160-076CF5DE6F92") });
            context.Aspects.Add(new Aspect { AspectPk = new Guid("14CFC28D-7CFE-4486-ADFC-821017F0A9F9"), AspectName = "Pub Meals", PreferenceCategoryPk = new Guid("5FF1197C-6623-4233-8160-076CF5DE6F92") });
            context.Aspects.Add(new Aspect { AspectPk = new Guid("3C3B537A-AB37-465B-97C3-3769F4E4D8A5"), AspectName = "Toasted Sandwich", PreferenceCategoryPk = new Guid("5FF1197C-6623-4233-8160-076CF5DE6F92") });
            context.Aspects.Add(new Aspect { AspectPk = new Guid("239344E0-F8EF-4AA1-B0AC-77C67FBFBD2E"), AspectName = "Bar Snacks", PreferenceCategoryPk = new Guid("5FF1197C-6623-4233-8160-076CF5DE6F92") });
            context.Aspects.Add(new Aspect { AspectPk = new Guid("F092BA73-71E8-4A5F-94DD-91D20C598205"), AspectName = "Asian", PreferenceCategoryPk = new Guid("5FF1197C-6623-4233-8160-076CF5DE6F92") });
            context.Aspects.Add(new Aspect { AspectPk = new Guid("B1329D26-C8D1-4494-8005-B92E29F550D4"), AspectName = "Indian", PreferenceCategoryPk = new Guid("5FF1197C-6623-4233-8160-076CF5DE6F92") });
            context.Aspects.Add(new Aspect { AspectPk = new Guid("F1337C1F-2E84-49D5-93AA-66C9A7019F87"), AspectName = "Korean BBQ", PreferenceCategoryPk = new Guid("5FF1197C-6623-4233-8160-076CF5DE6F92") });
            context.Aspects.Add(new Aspect { AspectPk = new Guid("B38F5DF6-5C8E-41C3-9AF1-CFF54EB799D4"), AspectName = "Home Style", PreferenceCategoryPk = new Guid("5FF1197C-6623-4233-8160-076CF5DE6F92") });
            context.Aspects.Add(new Aspect { AspectPk = new Guid("94142A5E-5068-4C0A-91DB-B63F0F20129E"), AspectName = "Sushi", PreferenceCategoryPk = new Guid("5FF1197C-6623-4233-8160-076CF5DE6F92") });
            context.Aspects.Add(new Aspect { AspectPk = new Guid("A43EA4D6-C947-4BC2-989D-CACE6AEDCDED"), AspectName = "Teppanyaki", PreferenceCategoryPk = new Guid("5FF1197C-6623-4233-8160-076CF5DE6F92") });
            context.Aspects.Add(new Aspect { AspectPk = new Guid("CAB19EF0-0E35-4DB5-9D52-FD5DDC27C5EF"), AspectName = "Steak House", PreferenceCategoryPk = new Guid("5FF1197C-6623-4233-8160-076CF5DE6F92") });

            context.Categories.Add(
                new PreferenceCategory { CategoryName = "Music Performance", PreferenceCategoryPk = new Guid("5384B9B6-1BDF-46F2-901A-6863D7EDEE1C") });
            context.Aspects.Add(new Aspect { AspectPk = new Guid("4F108AC2-26FD-4F69-BE44-970611EC6187"), AspectName = "Live", PreferenceCategoryPk = new Guid("5384B9B6-1BDF-46F2-901A-6863D7EDEE1C") });
            context.Aspects.Add(new Aspect { AspectPk = new Guid("5FEA5B99-D2A4-42B5-B00F-82897BD17E05"), AspectName = "DJ", PreferenceCategoryPk = new Guid("5384B9B6-1BDF-46F2-901A-6863D7EDEE1C") });
            context.Aspects.Add(new Aspect { AspectPk = new Guid("CFA90794-C418-4586-8EA1-A946BC37FF31"), AspectName = "Jukebox", PreferenceCategoryPk = new Guid("5384B9B6-1BDF-46F2-901A-6863D7EDEE1C") });
            context.Aspects.Add(new Aspect { AspectPk = new Guid("EEAFAE72-C6C8-4133-A5D5-75D029ECDF0F"), AspectName = "House System", PreferenceCategoryPk = new Guid("5384B9B6-1BDF-46F2-901A-6863D7EDEE1C") });
        }
    }
}